
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-red-500 to-red-700">
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`transition-all duration-1000 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col items-center space-y-8">
            {/* Nova imagem SB2 Coach estática e responsiva */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex items-center justify-center">
              <img 
                src="/lovable-uploads/f5b349d6-fd30-4802-8786-6097793a0967.png"
                alt="SB2 Coach - Seu companheiro de emagrecimento"
                className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-[60vh]"
              />
            </div>
          </div>
        </div>

        {/* Área do botão na parte inferior */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-4 right-4 max-w-md mx-auto">
          <div className={`transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-white/95 hover:bg-white text-red-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-2xl border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm relative overflow-hidden group text-base sm:text-lg"
            >
              <span className="relative z-10">Começar Jornada</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
