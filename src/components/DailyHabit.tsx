
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Droplets, Quote } from "lucide-react";

const DailyHabit = () => {
  const [capsuleTaken, setCapsuleTaken] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [dailyQuote, setDailyQuote] = useState("");

  const motivationalQuotes = [
    "Cada cápsula é um passo mais perto do seu objetivo! 💪",
    "Seu corpo está se transformando a cada dia com SB2 Turbo! ✨",
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
      {/* Frase Motivacional */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Quote className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">{dailyQuote}</p>
          </div>
        </CardContent>
      </Card>

      {/* Controle de Cápsula */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white">
            <span>SB2 Turbo Hoje</span>
            {capsuleTaken && (
              <Badge className="bg-red-100 text-red-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Tomado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCapsuleClick}
            variant={capsuleTaken ? "default" : "outline"}
            className={`w-full py-6 text-lg font-semibold transition-all ${
              capsuleTaken 
                ? "bg-red-600 hover:bg-red-700 text-white border-0" 
                : "border-2 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            }`}
          >
            {capsuleTaken ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Cápsula Tomada!
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Circle className="w-6 h-6" />
                Tomei a Cápsula Hoje
              </div>
            )}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2">
            {capsuleTaken ? "Ótimo! Continue assim!" : "2 cápsulas por dia - conforme orientação"}
          </p>
        </CardContent>
      </Card>

      {/* Lembrete de Água */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Droplets className="w-5 h-5 text-blue-400" />
            Hidratação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Copos de água hoje:</span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {waterCount} copos
            </Badge>
          </div>
          <Button 
            onClick={addWater}
            variant="outline" 
            className="w-full border-blue-400 text-blue-400 hover:bg-blue-50 bg-transparent"
          >
            + Bebi um copo d'água
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Meta: 8 copos por dia 💧
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyHabit;
