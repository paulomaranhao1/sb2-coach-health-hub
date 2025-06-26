
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Scale, Camera, Clock, TrendingUp, Zap } from "lucide-react";

interface HomeActionsProps {
  onAddWeight: () => void;
  onStartFasting: () => void;
  onAnalyzeFood: () => void;
  onViewProgress: () => void;
}

const HomeActions = ({
  onAddWeight,
  onStartFasting,
  onAnalyzeFood,
  onViewProgress
}: HomeActionsProps) => {
  const actions = [
    {
      title: "Registrar Peso",
      description: "Ganhe 10 pontos agora",
      benefit: "+50 pontos no primeiro registro",
      icon: <Scale className="w-6 h-6" />,
      onClick: onAddWeight,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      shadow: "shadow-blue-500/25 hover:shadow-blue-500/40"
    },
    {
      title: "Iniciar Jejum",
      description: "Queime gordura dormindo",
      benefit: "Até 50 pontos por jejum",
      icon: <Clock className="w-6 h-6" />,
      onClick: onStartFasting,
      color: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      shadow: "shadow-purple-500/25 hover:shadow-purple-500/40"
    },
    {
      title: "Analisar Comida",
      description: "IA conta calorias por você",
      benefit: "Precisão de 95%",
      icon: <Camera className="w-6 h-6" />,
      onClick: onAnalyzeFood,
      color: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      shadow: "shadow-green-500/25 hover:shadow-green-500/40"
    },
    {
      title: "Ver Progresso",
      description: "Acompanhe sua evolução",
      benefit: "Gráficos detalhados",
      icon: <TrendingUp className="w-6 h-6" />,
      onClick: onViewProgress,
      color: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      shadow: "shadow-orange-500/25 hover:shadow-orange-500/40"
    }
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Zap className="w-7 h-7 text-yellow-500" />
          Ações Rápidas
        </CardTitle>
        <p className="text-gray-600 text-lg">Escolha uma ação e ganhe pontos instantaneamente</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} ${action.shadow} text-white h-auto p-6 flex flex-col items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 border-0`}
            >
              <div className="bg-white/20 p-3 rounded-full">
                {action.icon}
              </div>
              <div className="text-center space-y-1">
                <div className="font-bold text-lg">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">
                  {action.benefit}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeActions;
