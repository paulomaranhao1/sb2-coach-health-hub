
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800">
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className={`transition-all duration-1000 w-full h-full flex items-center justify-center ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Nova imagem SB2coach.ai que preenche toda a tela */}
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/f8f1e84e-87a5-402c-b38e-56ddaf65fcc8.png"
              alt="SB2coach.ai - Seu companheiro de emagrecimento"
              className="w-full h-screen object-cover sm:object-contain sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl sm:h-auto sm:max-h-[70vh]"
            />
          </div>
        </div>

        {/* Área do botão na parte inferior - apenas visível em telas maiores que mobile */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-4 right-4 max-w-md mx-auto hidden sm:block">
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

        {/* Botão flutuante para mobile */}
        <div className="fixed bottom-6 left-4 right-4 z-20 sm:hidden">
          <div className={`transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-white/95 hover:bg-white text-red-600 font-semibold py-4 px-6 rounded-xl shadow-2xl border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm relative overflow-hidden group text-lg"
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
