
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const GoalProgressCard = () => {
  const goalProgress = ((75.2 - 72.5) / (75.2 - 68.0)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso da Meta</CardTitle>
        <CardDescription>
          Sua jornada rumo ao peso ideal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-900 dark:text-slate-100">Peso inicial: 75.2kg</span>
            <span className="text-slate-900 dark:text-slate-100">Meta: 68.0kg</span>
          </div>
          <Progress value={goalProgress} className="h-3" />
          <div className="text-center text-sm text-slate-800 dark:text-slate-200">
            {goalProgress.toFixed(1)}% concluído
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">2.7kg</p>
            <p className="text-xs text-slate-800 dark:text-slate-200">Perdidos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.5kg</p>
            <p className="text-xs text-slate-800 dark:text-slate-200">Restantes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">37%</p>
            <p className="text-xs text-slate-800 dark:text-slate-200">Completo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;
