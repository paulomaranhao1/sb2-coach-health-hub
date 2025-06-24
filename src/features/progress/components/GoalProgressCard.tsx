
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

const GoalProgressCard = () => {
  // Mock data - replace with actual user data
  const currentWeight = 68.5;
  const goalWeight = 65.0;
  const initialWeight = 75.2;
  
  const totalToLose = initialWeight - goalWeight;
  const lostSoFar = initialWeight - currentWeight;
  const progressPercentage = totalToLose > 0 ? (lostSoFar / totalToLose) * 100 : 0;

  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <Target className="w-5 h-5" />
          Meta de Peso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Peso inicial: {initialWeight}kg</span>
            <span>Meta: {goalWeight}kg</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="text-center">
            <span className="text-2xl font-bold text-red-600">
              {currentWeight}kg
            </span>
            <span className="text-sm text-gray-600 ml-2">atual</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-red-200">
          <div>
            <p className="text-lg font-bold text-green-600">
              {lostSoFar.toFixed(1)}kg
            </p>
            <p className="text-xs text-gray-600">Perdidos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">
              {(goalWeight - currentWeight).toFixed(1)}kg
            </p>
            <p className="text-xs text-gray-600">Restantes</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">
              {Math.ceil((goalWeight - currentWeight) / 0.5)}
            </p>
            <p className="text-xs text-gray-600">Semanas est.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;
