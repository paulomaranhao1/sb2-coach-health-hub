
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
      {/* Imagem de fundo otimizada para diferentes tamanhos de tela */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/69ce517f-1986-416d-b790-52e63fa8ec70.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay sutil para melhor legibilidade do botão */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Conteúdo sobreposto */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`transition-all duration-1000 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col items-center space-y-8">
            {/* Espaço no topo para deixar o logo do SB2FIT visível */}
            <div className="w-80 h-80" />
          </div>
        </div>

        {/* Área do botão na parte inferior */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className={`transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-white/95 hover:bg-white text-red-600 font-semibold py-4 px-8 rounded-xl shadow-2xl border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm relative overflow-hidden group text-lg"
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
