
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
      color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
      actions: [
        "Como definir minha meta de peso?",
        "Quanto tempo para emagrecer 10kg?",
        "Qual meu peso ideal?"
      ]
    },
    {
      category: "🍽️ Alimentação",
      icon: Utensils,
      color: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
      actions: [
        "Monte meu cardápio semanal",
        "Receitas saudáveis e gostosas",
        "Como controlar a fome?"
      ]
    },
    {
      category: "💪 Exercícios",
      icon: Dumbbell,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
      actions: [
        "Treino para iniciantes",
        "Exercícios em casa",
        "Como criar uma rotina?"
      ]
    },
    {
      category: "🧠 Motivação",
      icon: Brain,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
      actions: [
        "Estou desmotivado, me ajude",
        "Como manter a disciplina?",
        "Dicas para não desistir"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          ⚡ Ações Rápidas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Clique em qualquer pergunta para começar uma conversa
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <Card key={categoryIndex} className="border-gray-200 dark:border-gray-700">
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
                      className="w-full justify-start text-left h-auto p-2 text-xs hover:bg-red-50 dark:hover:bg-red-950 text-gray-700 dark:text-gray-300"
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Ou digite sua própria pergunta no chat acima
        </p>
      </div>
    </div>
  );
};

export default AIQuickActions;
