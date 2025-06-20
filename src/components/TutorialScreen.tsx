
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { tutorialSteps } from "./tutorial/tutorialSteps";
import TutorialProgressIndicator from "./tutorial/TutorialProgressIndicator";
import TutorialStep from "./tutorial/TutorialStep";
import TutorialNavigation from "./tutorial/TutorialNavigation";
import TutorialMotivationalMessage from "./tutorial/TutorialMotivationalMessage";

interface TutorialScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialScreen = ({ onComplete, onSkip }: TutorialScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <TutorialProgressIndicator 
            currentStep={currentStep}
            totalSteps={tutorialSteps.length}
          />
          
          <p className="text-gray-500 text-sm">
            {currentStep + 1} de {tutorialSteps.length}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Pular
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <TutorialStep stepData={currentStepData} />

          <TutorialNavigation 
            currentStep={currentStep}
            totalSteps={tutorialSteps.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          {currentStep === tutorialSteps.length - 1 && (
            <TutorialMotivationalMessage />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialScreen;
