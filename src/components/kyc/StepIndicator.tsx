import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-bold transition-all',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isCompleted
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-border bg-transparent text-muted-foreground'
              )}
            >
              {isCompleted ? '✔' : step}
            </div>
            <span
              className={cn(
                'text-xs text-center md:text-sm',
                isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              {steps[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
