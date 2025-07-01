
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const MotivationalSection = () => {
  const [dailyQuote, setDailyQuote] = useState("");

  const motivationalQuotes = [
    "Cada cápsula é um passo mais perto do seu objetivo! 💪",
    "Seu corpo está se transformando a cada dia com SB2 Coach! ✨",
    "Consistência é a chave do sucesso. Continue assim! 🔥",
    "Você é mais forte do que imagina. Persist! 🌟",
    "Cada dia é uma nova oportunidade de cuidar de você! 💖",
    "Seu futuro eu já está te agradecendo! 🙏",
    "Pequenos hábitos, grandes resultados! 🎯"
  ];

  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-center">
          <Quote className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed font-medium text-center">{dailyQuote}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalSection;
