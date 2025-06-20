
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressOverviewProps {
  userProfile: any;
  userStats: any;
}

const ProgressOverview = ({ userProfile, userStats }: ProgressOverviewProps) => {
  const currentWeight = userProfile?.weight || 0;
  const goalWeight = userProfile?.goal_weight || 0;
  const initialWeight = 75.2; // Você pode pegar isso do histórico
  
  const totalToLose = initialWeight - goalWeight;
  const lostSoFar = initialWeight - currentWeight;
  const progressPercentage = totalToLose > 0 ? (lostSoFar / totalToLose) * 100 : 0;

  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-red-700 dark:text-red-300">Progresso da Meta</span>
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200">
            {progressPercentage.toFixed(1)}% completo
          </Badge>
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
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              {currentWeight}kg
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">atual</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-red-200 dark:border-red-800">
          <div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {lostSoFar.toFixed(1)}kg
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Perdidos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {(goalWeight - currentWeight).toFixed(1)}kg
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Restantes</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {Math.ceil((goalWeight - currentWeight) / 0.5)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Semanas est.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
