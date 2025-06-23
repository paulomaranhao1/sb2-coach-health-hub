
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface TutorialNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

const TutorialNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious 
}: TutorialNavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2 text-slate-700 border-slate-300 hover:bg-slate-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Anterior
      </Button>

      <Button
        onClick={onNext}
        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
      >
        {isLastStep ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Começar!
          </>
        ) : (
          <>
            Próximo
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default TutorialNavigation;
