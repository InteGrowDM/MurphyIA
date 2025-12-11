import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Line before */}
              {step > 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-colors duration-300",
                    step <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
              
              {/* Step circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 border-2",
                  step < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step === currentStep
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              
              {/* Line after */}
              {step < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-colors duration-300",
                    step < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
            
            {/* Label */}
            <span
              className={cn(
                "mt-2 text-xs text-center transition-colors duration-300 hidden sm:block",
                step <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {labels[step - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
