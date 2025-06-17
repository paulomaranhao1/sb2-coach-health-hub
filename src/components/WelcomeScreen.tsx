
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowAnimation(true), 100);
    const timer2 = setTimeout(() => setShowSparkles(true), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-red-500/30 rounded-full animate-pulse transition-all duration-1000 ${
              showSparkles ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute w-4 h-4 text-red-400/60 transition-all duration-2000 ${
              showSparkles ? 'animate-pulse opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <Card className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm shadow-2xl border-red-500 relative z-10 transform transition-all duration-1000 hover:scale-105">
        <CardContent className="p-8 text-center space-y-6">
          {/* Logo com animação de entrada e brilho */}
          <div className={`transition-all duration-1500 ${
            showAnimation 
              ? 'scale-100 opacity-100 transform rotate-0' 
              : 'scale-50 opacity-0 transform -rotate-12'
          }`}>
            <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center relative">
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl transition-all duration-2000 ${
                showAnimation ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
              }`} />
              <img 
                src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
                alt="SB2FIT Logo" 
                className={`w-full h-full object-contain relative z-10 transition-all duration-1000 ${
                  showAnimation ? 'filter-none' : 'filter blur-sm'
                }`}
              />
            </div>
          </div>
          
          {/* Título com animação de escrita */}
          <div className={`transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              SB2FIT
            </h1>
            <p className={`text-gray-300 mb-6 transition-all duration-1000 delay-700 ${
              showAnimation ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
            }`}>
              Seu companheiro de emagrecimento
            </p>
            
            {/* Ícones animados */}
            <div className={`flex items-center justify-center gap-2 text-red-400 mb-6 transition-all duration-1000 delay-1000 ${
              showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}>
              <Heart className={`w-5 h-5 transition-all duration-500 ${
                showSparkles ? 'animate-pulse text-red-500' : ''
              }`} />
              <span className="text-sm font-medium">Transforme sua vida com SB2FIT</span>
              <Zap className={`w-5 h-5 transition-all duration-500 ${
                showSparkles ? 'animate-pulse text-yellow-400' : ''
              }`} />
            </div>
          </div>
          
          {/* Botão com animação de entrada e hover melhorado */}
          <div className={`transition-all duration-1000 delay-1200 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-lg shadow-lg border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Começar Jornada</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
