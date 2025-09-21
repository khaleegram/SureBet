
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { StepIndicator } from './StepIndicator';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2IdUpload } from './Step2IdUpload';
import { Step3FaceScan } from './Step3FaceScan';
import { Step4Acknowledgment } from './Step4Acknowledgment';
import { Step5Processing } from './Step5Processing';
import { Step6Result } from './Step6Result';

import { comprehensiveVerificationCheck } from '@/ai/flows/compare-facial-embeddings';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';
import { getIdToken } from 'firebase/auth';

type FormData = {
  personalInfo: any;
  idDocument: File | null;
  faceScans: File[];
};

type ResultStatus = 'success' | 'failure' | 'review';

const steps = ['Personal Info', 'ID Upload', 'Face Scan', 'Acknowledge', 'Verification'];

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

  const handleFaceScanNext = (files: File[]) => {
    setFormData((prev) => ({ ...prev, faceScans: files }));
    setCurrentStep(4);
  };

  const handleAcknowledgmentNext = async () => {
    const fullFormData = { ...formData };
    setCurrentStep(5); // Show processing screen

    try {
      // --- Firebase Auth User Creation ---
      const userCredential = await signUp(fullFormData.personalInfo.email, fullFormData.personalInfo.password);

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
         const idToken = await getIdToken(userCredential.user);
        // Set session cookie
        await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        
        toast({
          title: "Verification Complete!",
          description: "Welcome! You will be redirected to the dashboard.",
        });
        
        // Use a full page refresh to ensure cookie is set
        setTimeout(() => window.location.href = '/dashboard', 2000);
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
        setCurrentStep(6);
    }
  };


  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const handleAcknowledgmentDecline = () => {
      router.push('/');
  }

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
        return <Step4Acknowledgment onNext={handleAcknowledgmentNext} onBack={handleAcknowledgmentDecline} />;
      case 5:
        return <Step5Processing />;
      case 6:
        return result ? <Step6Result status={result.status} messages={result.messages} /> : <Step5Processing />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {currentStep <= 5 && (
        <StepIndicator currentStep={currentStep} totalSteps={5} steps={steps} />
      )}
      <div className="mt-4">{renderStep()}</div>
    </div>
  );
}
