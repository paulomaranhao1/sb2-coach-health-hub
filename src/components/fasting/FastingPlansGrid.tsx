
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Zap } from "lucide-react";

interface FastingPlan {
  name: string;
  description: string;
  calories: string;
  difficulty: string;
  color: string;
  benefits: string[];
}

interface FastingPlansGridProps {
  fastingPlans: { [key: string]: FastingPlan };
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  onStartFast: () => void;
}

const FastingPlansGrid = ({
  fastingPlans,
  selectedPlan,
  setSelectedPlan,
  onStartFast
}: FastingPlansGridProps) => {
  return (
    <>
      {/* Plan Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(fastingPlans).map(([key, plan]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedPlan === key 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedPlan(key)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{plan.name}</h3>
                <Badge className={plan.color}>{plan.difficulty}</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">{plan.description}</p>
              <p className="text-xs text-orange-600 font-medium mb-3">{plan.calories}</p>
              <div className="space-y-1">
                {plan.benefits.slice(0, 2).map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={onStartFast}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:scale-105 transition-all"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Jejum {selectedPlan}
        </Button>
      </div>
    </>
  );
};

export default FastingPlansGrid;
