import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SkipForward, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernWelcomeScreenProps {
  onContinue: () => void;
}

const ModernWelcomeScreen = ({ onContinue }: ModernWelcomeScreenProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const welcomeSteps = [
    {
      title: "Bem-vindo ao SB2coach.ai",
      subtitle: "Seu companheiro inteligente para uma vida mais saudável",
      image: "/lovable-uploads/f8f1e84e-87a5-402c-b38e-56ddaf65fcc8.png",
      gradient: "from-primary/20 via-primary-foreground to-primary/10"
    },
    {
      title: "Transforme seus hábitos",
      subtitle: "Acompanhe jejum, peso, suplementos e muito mais",
      image: "/lovable-uploads/f8f1e84e-87a5-402c-b38e-56ddaf65fcc8.png",
      gradient: "from-accent/20 via-background to-accent/10"
    },
    {
      title: "Comece sua jornada",
      subtitle: "Tudo pronto para começar sua transformação",
      image: "/lovable-uploads/f8f1e84e-87a5-402c-b38e-56ddaf65fcc8.png",
      gradient: "from-muted via-background to-muted/50"
    }
  ];

  const currentStepData = welcomeSteps[currentStep];

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue();
    }
  };


  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
        currentStepData.gradient
      )} />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-accent/60 rounded-full animate-pulse delay-300" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with skip option */}
        <div className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex space-x-1">
            {welcomeSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-primary w-8" : "bg-muted w-2"
                )}
              />
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onContinue()}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Pular
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
          <div className={cn(
            "transition-all duration-700 text-center space-y-6 max-w-md",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}>
            {/* Logo/Image */}
            <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64">
              <img 
                src={currentStepData.image}
                alt="SB2coach.ai"
                className="w-full h-full object-contain drop-shadow-2xl"
                onLoad={() => setIsLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-full" />
            </div>

            {/* Text content */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {currentStepData.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {currentStepData.subtitle}
              </p>
            </div>

          </div>
        </div>

        {/* Bottom action area */}
        <div className="p-4 sm:p-6 space-y-4">
          <Button 
            onClick={handleNext}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {currentStep < welcomeSteps.length - 1 ? (
              <>
                Continuar
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Começar Jornada
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {currentStep > 0 && (
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full text-muted-foreground"
            >
              Voltar
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ModernWelcomeScreen;