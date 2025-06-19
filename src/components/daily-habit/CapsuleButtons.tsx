
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Sun, Moon } from "lucide-react";

const CapsuleButtons = () => {
  const [morningCapsule, setMorningCapsule] = useState(false);
  const [eveningCapsule, setEveningCapsule] = useState(false);

  const handleMorningCapsuleClick = () => {
    setMorningCapsule(!morningCapsule);
  };

  const handleEveningCapsuleClick = () => {
    setEveningCapsule(!eveningCapsule);
  };

  const bothCapsulesTaken = morningCapsule && eveningCapsule;

  return (
    <>
      {/* Botões SB2 TURBO - Manhã e Noite */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Botão SB2 TURBO Manhã */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
          <CardContent className="p-4">
            <Button
              onClick={handleMorningCapsuleClick}
              variant={morningCapsule ? "default" : "outline"}
              className={`w-full h-24 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                morningCapsule 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg" 
                  : "border-2 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-200/50 dark:hover:bg-orange-800/50 bg-white/70 dark:bg-orange-900/20"
              }`}
            >
              <Sun className="w-6 h-6 flex-shrink-0" />
              {morningCapsule ? (
                <>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm leading-tight">Tomei!</span>
                </>
              ) : (
                <div className="text-center leading-tight">
                  <div className="font-bold text-base">SB2 TURBO</div>
                  <div className="text-sm opacity-90">MANHÃ</div>
                </div>
              )}
            </Button>
            {morningCapsule && (
              <div className="text-center mt-3">
                <Badge className="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-sm border-orange-300 dark:border-orange-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Manhã OK!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão SB2 TURBO Noite */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <Button
              onClick={handleEveningCapsuleClick}
              variant={eveningCapsule ? "default" : "outline"}
              className={`w-full h-24 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                eveningCapsule 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg" 
                  : "border-2 border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 bg-white/70 dark:bg-purple-900/20"
              }`}
            >
              <Moon className="w-6 h-6 flex-shrink-0" />
              {eveningCapsule ? (
                <>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm leading-tight">Tomei!</span>
                </>
              ) : (
                <div className="text-center leading-tight">
                  <div className="font-bold text-base">SB2 TURBO</div>
                  <div className="text-sm opacity-90">NOITE</div>
                </div>
              )}
            </Button>
            {eveningCapsule && (
              <div className="text-center mt-3">
                <Badge className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm border-purple-300 dark:border-purple-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Noite OK!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback quando ambas as cápsulas foram tomadas */}
      {bothCapsulesTaken && (
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 text-green-800 dark:text-green-200">
              <div className="p-3 rounded-full bg-green-200 dark:bg-green-800/50">
                <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <p className="font-semibold text-lg">Parabéns! Rotina completa!</p>
                <p className="text-sm">Você tomou suas 2 cápsulas de SB2 TURBO hoje! 🎉</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CapsuleButtons;
