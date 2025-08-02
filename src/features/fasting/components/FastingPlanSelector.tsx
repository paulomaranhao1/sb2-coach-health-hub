import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Zap, Info } from "lucide-react";
import { useState } from "react";
interface FastingPlan {
  name: string;
  description: string;
  benefits: string[];
  difficulty: string;
  color: string;
  calories: string;
  duration: number; // in seconds
  recommended: boolean;
  tips: string[];
}
interface FastingPlanSelectorProps {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  onStartFast: (planType: string, duration: number) => void;
}
const FastingPlanSelector = ({
  selectedPlan,
  setSelectedPlan,
  onStartFast
}: FastingPlanSelectorProps) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const fastingPlans: {
    [key: string]: FastingPlan;
  } = {
    "12:12": {
      name: "12:12 - Iniciante Friendly",
      description: "12h jejum, 12h janela alimentar - Perfeito para começar",
      difficulty: "Muito Fácil",
      benefits: ["Melhora digestão", "Regula sono", "Introdução suave"],
      color: "bg-green-500",
      calories: "Queima ~200 calorias extras",
      duration: 12 * 60 * 60,
      recommended: false,
      tips: ["Comece pular apenas o lanche da noite", "Mantenha hidratação constante"]
    },
    "14:10": {
      name: "14:10 - Adaptação",
      description: "14h jejum, 10h janela - Transição natural",
      difficulty: "Fácil",
      benefits: ["Controle do apetite", "Energia mais estável", "Flexibilidade social"],
      color: "bg-blue-500",
      calories: "Queima ~300 calorias extras",
      duration: 14 * 60 * 60,
      recommended: false,
      tips: ["Ideal para quem já fez 12:12 por 2 semanas", "Mantenha café da manhã tardio"]
    },
    "16:8": {
      name: "16:8 - O Clássico",
      description: "16h jejum, 8h janela - Mais popular e eficaz",
      difficulty: "Moderado",
      benefits: ["Perda de peso consistente", "Melhora metabólica", "Autofagia inicial"],
      color: "bg-purple-500",
      calories: "Queima ~400 calorias extras",
      duration: 16 * 60 * 60,
      recommended: true,
      tips: ["Janela típica: 12h às 20h", "Café preto permitido durante jejum"]
    },
    "18:6": {
      name: "18:6 - Avançado",
      description: "18h jejum, 6h janela - Para experientes",
      difficulty: "Difícil",
      benefits: ["Autofagia aumentada", "Queima intensa de gordura", "Disciplina mental"],
      color: "bg-orange-500",
      calories: "Queima ~500 calorias extras",
      duration: 18 * 60 * 60,
      recommended: false,
      tips: ["Apenas 2 refeições por dia", "Hidratação com eletrólitos essencial"]
    },
    "20:4": {
      name: "20:4 - Warrior Diet",
      description: "20h jejum, 4h janela - Estilo guerreiro",
      difficulty: "Muito Difícil",
      benefits: ["Máxima autofagia", "Extrema queima de gordura", "Clareza mental"],
      color: "bg-red-500",
      calories: "Queima ~600 calorias extras",
      duration: 20 * 60 * 60,
      recommended: false,
      tips: ["Uma refeição principal + lanche", "Preparação mental importante"]
    },
    "24:0": {
      name: "24:0 - OMAD",
      description: "24h jejum - Uma refeição por dia",
      difficulty: "Expert",
      benefits: ["Autofagia completa", "Máxima eficiência", "Economia de tempo"],
      color: "bg-gray-800",
      calories: "Queima ~700+ calorias extras",
      duration: 24 * 60 * 60,
      recommended: false,
      tips: ["Apenas fins de semana inicialmente", "Supervisão médica recomendada"]
    }
  };
  const handlePlanClick = (planKey: string) => {
    setSelectedPlan(planKey);
    setExpandedPlan(expandedPlan === planKey ? null : planKey);
  };
  const handleStartFast = () => {
    const plan = fastingPlans[selectedPlan];
    onStartFast(selectedPlan, plan.duration);
  };
  return <div className="space-y-6">
      {/* Plan Selection Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(fastingPlans).map(([key, plan]) => <Card key={key} className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${selectedPlan === key ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-xl transform scale-105' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`} onClick={() => handlePlanClick(key)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{plan.name}</h3>
                    {plan.recommended && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5">
                        Recomendado
                      </Badge>}
                  </div>
                  <Badge className={`${plan.color} text-white text-xs mb-2`}>
                    {plan.difficulty}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              setExpandedPlan(expandedPlan === key ? null : key);
            }}>
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {plan.description}
              </p>
              
              <p className="text-xs font-medium text-orange-600 mb-3">
                {plan.calories}
              </p>
              
              <div className="space-y-1">
                {plan.benefits.slice(0, 2).map((benefit, index) => <div key={index} className="flex items-center gap-2 text-xs">
                    <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>)}
              </div>
              
              {/* Expanded Details */}
              {expandedPlan === key && <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Todos os Benefícios:
                    </h4>
                    <div className="space-y-1">
                      {plan.benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 text-xs">
                          <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                        </div>)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Dicas Importantes:
                    </h4>
                    <div className="space-y-1">
                      {plan.tips.map((tip, index) => <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                          • {tip}
                        </div>)}
                    </div>
                  </div>
                </div>}
            </CardContent>
          </Card>)}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button onClick={handleStartFast} size="lg" className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 py-[15px] px-[30px]">
          <Play className="w-6 h-6 mr-3" />
          Iniciar Jejum {selectedPlan}
        </Button>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto">
          <strong>Dica:</strong> {fastingPlans[selectedPlan]?.tips[0] || "Mantenha-se hidratado e escute seu corpo durante o jejum."}
        </p>
      </div>
    </div>;
};
export default FastingPlanSelector;