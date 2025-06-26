
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, TrendingUp, Target } from "lucide-react";

interface SmartCTAProps {
  userStats: any;
  weightEntries: any[];
  onAction: (action: string) => void;
}

const SmartCTA = ({ userStats, weightEntries, onAction }: SmartCTAProps) => {
  // Determine the best next action based on user data
  const getSmartSuggestion = () => {
    if (!userStats || userStats.points === 0) {
      return {
        title: "Comece sua jornada!",
        description: "Registre seu primeiro peso e ganhe 50 pontos",
        action: "weight",
        actionText: "Registrar Peso",
        icon: <Plus className="w-5 h-5" />,
        color: "bg-gradient-to-r from-blue-500 to-cyan-500"
      };
    }

    if (weightEntries.length === 0 || !weightEntries) {
      return {
        title: "Que tal registrar seu peso?",
        description: "Mantenha o controle do seu progresso diário",
        action: "weight",
        actionText: "Registrar Peso",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "bg-gradient-to-r from-green-500 to-emerald-500"
      };
    }

    if (userStats.streak === 0 || !userStats.streak) {
      return {
        title: "Comece um streak!",
        description: "Registre seu peso por 7 dias seguidos e ganhe bônus",
        action: "weight",
        actionText: "Continuar Streak",
        icon: <Target className="w-5 h-5" />,
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      };
    }

    if (userStats.total_photos_analyzed === 0 || !userStats.total_photos_analyzed) {
      return {
        title: "Analise sua primeira refeição!",
        description: "Descubra as calorias da sua comida instantaneamente",
        action: "food",
        actionText: "Analisar Comida",
        icon: <Plus className="w-5 h-5" />,
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      };
    }

    // Default suggestion for active users
    return {
      title: "Continue progredindo!",
      description: `Você tem ${userStats.points} pontos. Que tal um novo desafio?`,
      action: "fasting",
      actionText: "Iniciar Jejum",
      icon: <ArrowRight className="w-5 h-5" />,
      color: "bg-gradient-to-r from-indigo-500 to-purple-500"
    };
  };

  const suggestion = getSmartSuggestion();

  return (
    <Card className={`${suggestion.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-white/90 transition-colors">
              {suggestion.title}
            </h3>
            <p className="text-white/80 text-sm mb-4 group-hover:text-white/70 transition-colors">
              {suggestion.description}
            </p>
            <Button 
              onClick={() => onAction(suggestion.action)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-200"
              size="sm"
            >
              {suggestion.icon}
              <span className="ml-2">{suggestion.actionText}</span>
            </Button>
          </div>
          <div className="hidden md:block opacity-20 group-hover:opacity-30 transition-opacity">
            <ArrowRight className="w-12 h-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartCTA;
