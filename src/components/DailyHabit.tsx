
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Droplets, Quote, Sparkles } from "lucide-react";

const DailyHabit = () => {
  const [capsuleTaken, setCapsuleTaken] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [dailyQuote, setDailyQuote] = useState("");

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

  const handleCapsuleClick = () => {
    setCapsuleTaken(!capsuleTaken);
  };

  const addWater = () => {
    setWaterCount(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Botões Principais no Topo */}
      <div className="grid grid-cols-2 gap-3">
        {/* Botão SB2FIT */}
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <Button
              onClick={handleCapsuleClick}
              variant={capsuleTaken ? "default" : "outline"}
              className={`w-full h-16 text-sm font-semibold transition-all duration-300 ${
                capsuleTaken 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg" 
                  : "border-2 border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-transparent"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                {capsuleTaken ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs">Tomada!</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5" />
                    <span className="text-xs">SB2FIT</span>
                  </>
                )}
              </div>
            </Button>
            {capsuleTaken && (
              <div className="text-center mt-2">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ótimo!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão Hidratação */}
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <Button 
              onClick={addWater}
              variant="outline" 
              className="w-full h-16 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <Droplets className="w-5 h-5" />
                <span className="text-xs">Água</span>
              </div>
            </Button>
            <div className="text-center mt-2">
              <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 text-xs">
                {waterCount} copos
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frase Motivacional */}
      <Card className="glass border-0 shadow-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
              <Quote className="w-4 h-4" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed flex-1">{dailyQuote}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Dosagem SB2FIT</p>
              <p className="text-xs font-medium">2 cápsulas/dia</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Meta de Água</p>
              <p className="text-xs font-medium">8 copos/dia 💧</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyHabit;
