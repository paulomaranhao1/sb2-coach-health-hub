
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Scale, Camera, Clock, TrendingUp } from "lucide-react";

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
      description: "Adicione seu peso atual",
      icon: <Scale className="w-5 h-5" />,
      onClick: onAddWeight,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Iniciar Jejum",
      description: "Comece uma nova sessão",
      icon: <Clock className="w-5 h-5" />,
      onClick: onStartFasting,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Analisar Comida",
      description: "Tire uma foto da refeição",
      icon: <Camera className="w-5 h-5" />,
      onClick: onAnalyzeFood,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Ver Progresso",
      description: "Acompanhe sua evolução",
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: onViewProgress,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-200`}
            >
              {action.icon}
              <div className="text-center">
                <div className="font-semibold text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeActions;
