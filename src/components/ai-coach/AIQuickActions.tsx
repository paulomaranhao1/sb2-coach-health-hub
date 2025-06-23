
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Target, Utensils, Dumbbell, Heart, Brain } from "lucide-react";

interface AIQuickActionsProps {
  onSendMessage: (message: string) => void;
}

const AIQuickActions = ({ onSendMessage }: AIQuickActionsProps) => {
  const quickActions = [
    {
      category: "🎯 Objetivos",
      icon: Target,
      color: "bg-red-100 text-red-800",
      actions: [
        "Como definir minha meta de peso ideal?",
        "Quanto tempo para emagrecer 10kg de forma saudável?",
        "Como o SB2 Turbo pode acelerar meus resultados?"
      ]
    },
    {
      category: "🍽️ Alimentação",
      icon: Utensils,
      color: "bg-green-100 text-green-800",
      actions: [
        "Monte um cardápio semanal para emagrecer",
        "Receitas saudáveis e gostosas para o dia a dia",
        "Como controlar a fome entre as refeições?"
      ]
    },
    {
      category: "💪 Exercícios",
      icon: Dumbbell,
      color: "bg-blue-100 text-blue-800",
      actions: [
        "Treino para iniciantes em casa",
        "Exercícios que queimam mais gordura",
        "Como criar uma rotina de exercícios?"
      ]
    },
    {
      category: "🧠 Motivação",
      icon: Brain,
      color: "bg-purple-100 text-purple-800",
      actions: [
        "Estou desmotivado, preciso de ajuda",
        "Como manter a disciplina na dieta?",
        "Dicas para não desistir dos objetivos"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 mb-2">
          ⚡ Ações Rápidas
        </h3>
        <p className="text-sm text-gray-600">
          Clique em qualquer pergunta para começar uma conversa
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <Card key={categoryIndex} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={category.color}>
                    <IconComponent className="w-3 h-3 mr-1" />
                    {category.category}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {category.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs hover:bg-red-50 text-gray-700"
                      onClick={() => onSendMessage(action)}
                    >
                      <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-left">{action}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Ou digite sua própria pergunta no chat acima
        </p>
      </div>
    </div>
  );
};

export default AIQuickActions;
