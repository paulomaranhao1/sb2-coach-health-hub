
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
      {/* Imagem de fundo que cobre toda a tela */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/6c754106-57db-4aff-8504-b56e5e83b445.png')`
        }}
      />
      
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Área do botão na parte inferior */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className={`transition-all duration-1000 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 relative overflow-hidden group text-lg"
            >
              <span className="relative z-10">Começar Jornada</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
