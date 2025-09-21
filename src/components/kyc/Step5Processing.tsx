
import { Loader2 } from 'lucide-react';

const processingSteps = [
    "Extracting data from ID with OCR...",
    "Comparing facial embeddings...",
    "Estimating age from facial scan...",
    "Finalizing verification..."
]

export function Step5Processing() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <h3 className="text-2xl font-semibold font-headline">Verifying Your Identity</h3>
      <p className="text-muted-foreground">
        This will only take a moment. Please don't close this window.
      </p>
      {/* Example of showing detailed steps */}
      {/* <div className="text-sm text-muted-foreground animate-pulse">
        {processingSteps[Math.floor(Math.random() * processingSteps.length)]}
      </div> */}
    </div>
  );
}
