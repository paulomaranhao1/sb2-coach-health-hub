
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap } from "lucide-react";

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen = ({ onContinue }: WelcomeScreenProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm shadow-2xl border-red-500">
        <CardContent className="p-8 text-center space-y-6">
          <div className={`transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/lovable-uploads/56b2f2a3-31ca-4b1d-a48b-64b4b54b99f5.png" 
                alt="SB2FIT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl font-bold text-white mb-2">SB2FIT</h1>
            <p className="text-gray-300 mb-6">Seu companheiro de emagrecimento</p>
            
            <div className="flex items-center justify-center gap-2 text-red-400 mb-6">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Transforme sua vida com SB2FIT</span>
              <Zap className="w-5 h-5" />
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-lg shadow-lg border-0"
            >
              Começar Jornada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
