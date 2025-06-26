
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, TrendingUp, Target, Zap, Star } from "lucide-react";

interface SmartCTAProps {
  userStats: any;
  weightEntries: any[];
  onAction: (action: string) => void;
}

const SmartCTA = ({
  userStats,
  weightEntries,
  onAction
}: SmartCTAProps) => {
  // Determine the best next action based on user data
  const getSmartSuggestion = () => {
    if (!userStats || userStats.points === 0) {
      return {
        title: "🎯 Ganhe seus primeiros 50 pontos!",
        description: "Registre seu peso agora e comece sua jornada de transformação",
        action: "weight",
        actionText: "Registrar meu peso",
        icon: <Zap className="w-5 h-5" />,
        color: "bg-gradient-to-r from-emerald-500 to-teal-600",
        urgency: "2 minutos para começar!"
      };
    }
    
    if (weightEntries.length === 0 || !weightEntries) {
      return {
        title: "📈 Monitore seu progresso diário",
        description: "Pessoas que registram peso diariamente perdem 2x mais peso",
        action: "weight",
        actionText: "Registrar peso hoje",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        urgency: "Não perca o dia de hoje!"
      };
    }
    
    if (userStats.streak === 0 || !userStats.streak) {
      return {
        title: "🔥 Construa uma sequência vencedora",
        description: "7 dias consecutivos = bônus especial de 100 pontos",
        action: "weight",
        actionText: "Continuar sequência",
        icon: <Target className="w-5 h-5" />,
        color: "bg-gradient-to-r from-orange-500 to-red-500",
        urgency: "Comece hoje mesmo!"
      };
    }
    
    if (userStats.total_photos_analyzed === 0 || !userStats.total_photos_analyzed) {
      return {
        title: "📸 Descubra as calorias instantaneamente",
        description: "IA analisa sua refeição em segundos - 95% de precisão",
        action: "food",
        actionText: "Analisar primeira refeição",
        icon: <Star className="w-5 h-5" />,
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        urgency: "Funciona com qualquer comida!"
      };
    }

    // Default suggestion for active users
    return {
      title: "⚡ Acelere seus resultados",
      description: `${userStats.points} pontos conquistados! Que tal um jejum intermitente?`,
      action: "fasting",
      actionText: "Iniciar jejum agora",
      icon: <ArrowRight className="w-5 h-5" />,
      color: "bg-gradient-to-r from-violet-500 to-purple-600",
      urgency: "Queime gordura enquanto descansa!"
    };
  };

  const suggestion = getSmartSuggestion();

  return (
    <Card className={`${suggestion.color} text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]`}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3 group-hover:text-white/95 transition-colors">
              {suggestion.title}
            </h3>
            <p className="text-white/90 text-lg mb-2 group-hover:text-white/85 transition-colors">
              {suggestion.description}
            </p>
            <p className="text-white/70 text-sm mb-6 font-medium">
              {suggestion.urgency}
            </p>
            <Button 
              onClick={() => onAction(suggestion.action)} 
              size="lg" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-bold text-lg px-8 py-6"
            >
              {suggestion.icon}
              <span className="ml-3">{suggestion.actionText}</span>
            </Button>
          </div>
          <div className="hidden md:block opacity-30 group-hover:opacity-50 transition-opacity ml-8">
            <ArrowRight className="w-16 h-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartCTA;
