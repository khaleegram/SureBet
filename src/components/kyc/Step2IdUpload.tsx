'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';

interface Step2IdUploadProps {
  onNext: (file: File) => void;
  onBack: () => void;
}

export function Step2IdUpload({ onNext, onBack }: Step2IdUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError('File size must be less than 4MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or WEBP.');
        return;
      }

      setError(null);
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onNext(file);
    } else {
      setError('Please upload an ID document.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Upload Your ID</h3>
        <p className="text-muted-foreground">
          Please upload a clear image of your passport, driver's license, or national ID card.
        </p>
      </div>

      <div className="flex justify-center items-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted border-border hover:border-primary transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
          </label>
      </div>

      {preview && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Image Preview:</h4>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image src={preview} alt="ID Preview" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!file}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
