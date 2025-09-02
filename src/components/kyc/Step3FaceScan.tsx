'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, FileImage, CheckCircle } from 'lucide-react';

interface Step3FaceScanProps {
  onNext: (files: File[]) => void;
  onBack: () => void;
}

const NUM_SCANS = 3;

export function Step3FaceScan({ onNext, onBack }: Step3FaceScanProps) {
  const [scans, setScans] = useState<(File | null)[]>(Array(NUM_SCANS).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(Array(NUM_SCANS).fill(null));
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('File size must be less than 4MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or WEBP.');
        return;
      }

      setError(null);
      
      const newScans = [...scans];
      newScans[index] = file;
      setScans(newScans);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result as string;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTriggerClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  }

  const handleSubmit = () => {
    if (scans.every(scan => scan !== null)) {
      onNext(scans.filter(s => s !== null) as File[]);
    } else {
      setError(`Please provide all ${NUM_SCANS} facial scans.`);
    }
  };
  
  const allScansCompleted = scans.every(scan => scan !== null);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">Live Face Scan Simulation</h3>
        <p className="text-muted-foreground">
          To verify your identity, we need to simulate capturing a few live photos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: NUM_SCANS }).map((_, index) => (
          <div key={index}>
            <input
              type="file"
              ref={el => fileInputRefs.current[index] = el}
              className="hidden"
              onChange={(e) => handleFileChange(e, index)}
              accept="image/png, image/jpeg, image/webp"
            />
            <button
              onClick={() => handleTriggerClick(index)}
              className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted hover:border-primary transition-colors relative"
              style={{
                backgroundImage: previews[index] ? `url(${previews[index]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!previews[index] && (
                <>
                  <Camera className="w-8 h-8 mb-2" />
                  <span>Scan #{index + 1}</span>
                </>
              )}
              {previews[index] && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <FileImage className="w-8 h-8 text-white" />
                </div>
              )}
               {previews[index] && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Scan Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {allScansCompleted && (
         <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-300">
          <CheckCircle className="h-4 w-4 !text-green-400" />
          <AlertTitle>All Scans Completed</AlertTitle>
          <AlertDescription>
            You can now proceed to the final verification step.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!allScansCompleted}>
          Verify Identity
        </Button>
      </div>
    </div>
  );
}
