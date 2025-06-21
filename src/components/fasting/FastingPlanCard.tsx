
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import FastingPlanSelector from "./FastingPlanSelector";

interface FastingPlanCardProps {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  onStartFast: (planType: string, duration: number) => void;
}

const FastingPlanCard = ({ selectedPlan, setSelectedPlan, onStartFast }: FastingPlanCardProps) => {
  return (
    <Card className="border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-700 dark:text-gray-200">
          <Timer className="w-8 h-8" />
          Escolha Seu Plano de Jejum
        </CardTitle>
        <CardDescription className="text-lg">
          Selecione o plano ideal para seu nível e objetivos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FastingPlanSelector 
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          onStartFast={onStartFast}
        />
      </CardContent>
    </Card>
  );
};

export default FastingPlanCard;
