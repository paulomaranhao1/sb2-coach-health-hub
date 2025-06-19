
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
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <Card className="glass border-0 shadow-lg overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1 flex-shrink-0">
            <img 
              src="/lovable-uploads/a525ce97-c7e6-461b-a78a-f7d3756a07ff.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex-1 font-medium">{dailyQuote}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalSection;
