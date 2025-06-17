
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fundo gradiente vermelho */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800" />
      
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo SB2FIT centralizado */}
        <div className={`transition-all duration-1000 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col items-center space-y-8">
            <img 
              src="/lovable-uploads/49b74c82-5fef-43c9-b904-b846db8b49f8.png" 
              alt="SB2FIT Logo" 
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>

        {/* Área do botão na parte inferior */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className={`transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-white hover:bg-gray-100 text-red-600 font-semibold py-4 px-8 rounded-xl shadow-lg border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group text-lg"
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
