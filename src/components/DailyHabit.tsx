
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Droplets, Quote, Sparkles, Sun, Moon } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

const DailyHabit = () => {
  const [morningCapsule, setMorningCapsule] = useState(false);
  const [eveningCapsule, setEveningCapsule] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [dailyQuote, setDailyQuote] = useState("");
  const { profile } = useUserProfile();

  const motivationalQuotes = [
    "Cada cápsula é um passo mais perto do seu objetivo! 💪",
    "Seu corpo está se transformando a cada dia com SB2FIT! ✨",
    "Consistência é a chave do sucesso. Continue assim! 🔥",
    "Você é mais forte do que imagina. Persist! 🌟",
    "Cada dia é uma nova oportunidade de cuidar de você! 💖",
    "Seu futuro eu já está te agradecendo! 🙏",
    "Pequenos hábitos, grandes resultados! 🎯"
  ];

  useEffect(() => {
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  const handleMorningCapsuleClick = () => {
    setMorningCapsule(!morningCapsule);
  };

  const handleEveningCapsuleClick = () => {
    setEveningCapsule(!eveningCapsule);
  };

  const addWater = () => {
    setWaterCount(prev => prev + 1);
  };

  const bothCapsulesTaken = morningCapsule && eveningCapsule;
  
  // Cálculo da água consumida e recomendada (fixo em 2000ml)
  const waterConsumedMl = waterCount * 200; // 200ml por copo
  const recommendedWaterMl = 2000; // 2000ml fixo (10 copos)
  const waterPercentage = Math.min((waterConsumedMl / recommendedWaterMl) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Botões SB2 TURBO - Manhã e Noite */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Botão SB2 TURBO Manhã */}
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <Button
              onClick={handleMorningCapsuleClick}
              variant={morningCapsule ? "default" : "outline"}
              className={`w-full h-24 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                morningCapsule 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg" 
                  : "border-2 border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-transparent"
              }`}
            >
              <Sun className="w-6 h-6 flex-shrink-0" />
              {morningCapsule ? (
                <>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm leading-tight">Tomei!</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 flex-shrink-0" />
                  <div className="text-center leading-tight">
                    <div className="font-bold text-base">SB2 TURBO</div>
                    <div className="text-sm opacity-90">MANHÃ</div>
                  </div>
                </>
              )}
            </Button>
            {morningCapsule && (
              <div className="text-center mt-3">
                <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Manhã OK!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão SB2 TURBO Noite */}
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <Button
              onClick={handleEveningCapsuleClick}
              variant={eveningCapsule ? "default" : "outline"}
              className={`w-full h-24 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                eveningCapsule 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg" 
                  : "border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
              }`}
            >
              <Moon className="w-6 h-6 flex-shrink-0" />
              {eveningCapsule ? (
                <>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm leading-tight">Tomei!</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 flex-shrink-0" />
                  <div className="text-center leading-tight">
                    <div className="font-bold text-base">SB2 TURBO</div>
                    <div className="text-sm opacity-90">NOITE</div>
                  </div>
                </>
              )}
            </Button>
            {eveningCapsule && (
              <div className="text-center mt-3">
                <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Noite OK!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Botão Hidratação */}
      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-5">
          <Button 
            onClick={addWater}
            variant="outline" 
            className="w-full h-20 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent transition-all duration-300 flex flex-col items-center justify-center gap-2"
          >
            <Droplets className="w-6 h-6 flex-shrink-0" />
            <div className="text-center leading-tight">
              <div className="font-semibold text-base">BEBI UM COPO</div>
              <div className="text-sm opacity-90">DE ÁGUA (200ml)</div>
            </div>
          </Button>
          
          {/* Informações detalhadas da água */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Consumido hoje:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {waterConsumedMl}ml ({waterCount} copos)
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Meta diária:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {recommendedWaterMl}ml (10 copos)
              </span>
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${waterPercentage}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <Badge 
                variant="outline" 
                className={`text-sm ${
                  waterPercentage >= 100 
                    ? 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600' 
                    : 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600'
                }`}
              >
                {waterPercentage.toFixed(0)}% da meta diária
                {waterPercentage >= 100 && ' 🎉'}
              </Badge>
            </div>
            
            <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
              Meta padrão: 2000ml (10 copos) por dia
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback quando ambas as cápsulas foram tomadas */}
      {bothCapsulesTaken && (
        <Card className="glass border-0 shadow-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 text-green-800 dark:text-green-200">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">Parabéns! Rotina completa!</p>
                <p className="text-sm">Você tomou suas 2 cápsulas de SB2 TURBO hoje! 🎉</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frase Motivacional */}
      <Card className="glass border-0 shadow-lg overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
              <Quote className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex-1 font-medium">{dailyQuote}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Dosagem SB2 TURBO</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">2 cápsulas/dia</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Meta de Água</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                10 copos/dia 💧
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyHabit;
