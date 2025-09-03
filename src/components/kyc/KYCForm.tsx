
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { StepIndicator } from './StepIndicator';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2IdUpload } from './Step2IdUpload';
import { Step3FaceScan } from './Step3FaceScan';
import { Step4Processing } from './Step4Processing';
import { Step5Result } from './Step5Result';

import { comprehensiveVerificationCheck } from '@/ai/flows/compare-facial-embeddings';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';

type FormData = {
  personalInfo: any;
  idDocument: File | null;
  faceScans: File[];
};

type ResultStatus = 'success' | 'failure' | 'review';

const steps = ['Personal Info', 'ID Upload', 'Face Scan', 'Verification'];

export function KYCForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      email: '',
      phone: '',
      country: '',
      password: '',
    },
    idDocument: null,
    faceScans: [],
  });
  const [result, setResult] = useState<{ status: ResultStatus, messages: string[] } | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { signUp } = useAuth();


  const handlePersonalInfoNext = (data: any) => {
    setFormData((prev) => ({ ...prev, personalInfo: data }));
    setCurrentStep(2);
  };

  const handleIdUploadNext = (file: File) => {
    setFormData((prev) => ({ ...prev, idDocument: file }));
    setCurrentStep(3);
  };

  const handleFaceScanNext = async (files: File[]) => {
    const fullFormData = { ...formData, faceScans: files };
    setFormData(fullFormData);
    setCurrentStep(4); // Show processing screen

    try {
      // --- Firebase Auth User Creation ---
      await signUp(fullFormData.personalInfo.email, fullFormData.personalInfo.password);

      // --- AI Verification Flow ---
      const idDataUri = await fileToDataUri(fullFormData.idDocument!);
      const faceScanDataUris = await Promise.all(
        fullFormData.faceScans.map(fileToDataUri)
      );

      const verificationResult = await comprehensiveVerificationCheck({
        idPhotoDataUri: idDataUri,
        livePhotoDataUris: faceScanDataUris,
        formFullName: fullFormData.personalInfo.fullName,
        formDateOfBirth: fullFormData.personalInfo.dateOfBirth,
      });

      setResult({
        status: verificationResult.verificationStatus,
        messages: verificationResult.reasoning,
      });

      if (verificationResult.verificationStatus === 'success') {
         toast({
          title: "Verification Complete!",
          description: "Welcome! You will be redirected to the dashboard.",
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      }
      
    } catch (error: any) {
      console.error('Verification process failed:', error);
       let errorMessage = 'An unexpected system error occurred during verification.';
       if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use by another account.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use a stronger password.';
            break;
          default:
            errorMessage = 'An error occurred during sign up. Please try again.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: errorMessage,
      });
      setResult({ status: 'failure', messages: [errorMessage] });
    } finally {
        setCurrentStep(5);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            onNext={handlePersonalInfoNext}
            defaultValues={formData.personalInfo}
          />
        );
      case 2:
        return <Step2IdUpload onNext={handleIdUploadNext} onBack={handleBack} />;
      case 3:
        return <Step3FaceScan onNext={handleFaceScanNext} onBack={handleBack} />;
      case 4:
        return <Step4Processing />;
      case 5:
        return result ? <Step5Result status={result.status} messages={result.messages} /> : <Step4Processing />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {currentStep <= 4 && (
        <StepIndicator currentStep={currentStep} totalSteps={4} steps={steps} />
      )}
      <div className="mt-4">{renderStep()}</div>
    </div>
  );
}
