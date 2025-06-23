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
const TutorialScreen = ({
  onComplete,
  onSkip
}: TutorialScreenProps) => {
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
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg backdrop-blur-sm shadow-2xl border-0 animate-fade-in bg-slate-600">
        <CardHeader className="text-center pb-4 bg-slate-600">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" alt="SB2coach.ai Logo" className="w-full h-full object-contain" />
          </div>
          
          <TutorialProgressIndicator currentStep={currentStep} totalSteps={tutorialSteps.length} />
          
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {currentStep + 1} de {tutorialSteps.length}
          </p>

          <Button variant="ghost" size="sm" onClick={onSkip} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-4 h-4 mr-1" />
            Pular
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 bg-slate-600">
          <TutorialStep stepData={currentStepData} />

          <TutorialNavigation currentStep={currentStep} totalSteps={tutorialSteps.length} onNext={handleNext} onPrevious={handlePrevious} />

          {currentStep === tutorialSteps.length - 1 && <TutorialMotivationalMessage />}
        </CardContent>
      </Card>
    </div>;
};
export default TutorialScreen;