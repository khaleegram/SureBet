'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { StepIndicator } from './StepIndicator';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2IdUpload } from './Step2IdUpload';
import { Step3FaceScan } from './Step3FaceScan';
import { Step4Processing } from './Step4Processing';
import { Step5Result } from './Step5Result';

import { extractIdData } from '@/ai/flows/extract-id-data-with-ocr';
import { compareFacialEmbeddings } from '@/ai/flows/compare-facial-embeddings';
import { estimateAgeFromFacialScan } from '@/ai/flows/estimate-age-from-facial-scan';

import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';

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
    personalInfo: {},
    idDocument: null,
    faceScans: [],
  });
  const [result, setResult] = useState<{ status: ResultStatus, messages: string[] } | null>(null);
  const { toast } = useToast();
  const router = useRouter();


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
      // Convert files to data URIs
      const idDataUri = await fileToDataUri(fullFormData.idDocument!);
      const faceScanDataUris = await Promise.all(
        fullFormData.faceScans.map(fileToDataUri)
      );

      const reviewMessages: string[] = [];
      const failureMessages: string[] = [];

      // --- AI Flow 1: Extract ID Data ---
      const ocrResult = await extractIdData({ idDataUri });
      if (ocrResult.fullName.toLowerCase() !== fullFormData.personalInfo.fullName.toLowerCase()) {
        reviewMessages.push(`Name mismatch: Form says "${fullFormData.personalInfo.fullName}", ID says "${ocrResult.fullName}".`);
      }
      // Note: DOB comparison can be tricky due to formats. Simplified for demo.
      if (ocrResult.dateOfBirth !== fullFormData.personalInfo.dateOfBirth) {
         reviewMessages.push(`Date of birth mismatch: Form says "${fullFormData.personalInfo.dateOfBirth}", ID says "${ocrResult.dateOfBirth}".`);
      }
      
      // --- AI Flow 2: Compare Facial Embeddings ---
      const facialResult = await compareFacialEmbeddings({
        idPhotoDataUri: idDataUri, // Assuming ID photo is the same as the document for this demo
        livePhotoDataUris: faceScanDataUris,
      });

      if (facialResult.reviewRequired) {
        reviewMessages.push('Facial scan similarity is low, requiring manual review.');
      }
      if (!facialResult.isMatch) {
        failureMessages.push('Facial scan does not match the ID photo.');
      }

      // --- AI Flow 3: Estimate Age ---
      const ageResult = await estimateAgeFromFacialScan({
        faceDataUri: faceScanDataUris[0], // Use first live scan for age check
        dateOfBirth: fullFormData.personalInfo.dateOfBirth,
      });

      if (ageResult.reviewRequired) {
        reviewMessages.push(`Estimated age (${ageResult.estimatedAge}) is not close to the age on ID.`);
      }

      // --- Determine Final Result ---
      if (failureMessages.length > 0) {
        setResult({ status: 'failure', messages: failureMessages });
      } else if (reviewMessages.length > 0) {
        setResult({ status: 'review', messages: reviewMessages });
      } else {
        setResult({ status: 'success', messages: [] });
        toast({
          title: "Verification Complete!",
          description: "You will be redirected to the dashboard.",
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Verification process failed:', error);
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: 'Please try again. If the problem persists, contact support.',
      });
      setResult({ status: 'failure', messages: ['An unexpected system error occurred during verification.'] });
    } finally {
        // Move to the result step after processing
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
