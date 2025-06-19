
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const MotivationalSection = () => {
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

  return (
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
  );
};

export default MotivationalSection;
