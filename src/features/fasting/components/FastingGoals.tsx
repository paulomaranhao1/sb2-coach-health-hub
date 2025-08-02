
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar } from "lucide-react";

interface FastingGoal {
  weekly: number;
  monthly: number;
  currentWeek: number;
  currentMonth: number;
}

interface FastingGoalsProps {
  fastingGoals: FastingGoal;
}

const FastingGoals = ({ fastingGoals }: FastingGoalsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Metas Semanais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso da Semana</span>
              <span>{fastingGoals.currentWeek}/{fastingGoals.weekly}</span>
            </div>
            <Progress value={(fastingGoals.currentWeek / fastingGoals.weekly) * 100} className="h-2" />
            <p className="text-xs text-gray-600">
              {fastingGoals.weekly - fastingGoals.currentWeek > 0 
                ? `Faltam ${fastingGoals.weekly - fastingGoals.currentWeek} jejuns para bater a meta!`
                : "🎉 Meta semanal batida!"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Metas Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso do Mês</span>
              <span>{fastingGoals.currentMonth}/{fastingGoals.monthly}</span>
            </div>
            <Progress value={(fastingGoals.currentMonth / fastingGoals.monthly) * 100} className="h-2" />
            <p className="text-xs text-gray-600">
              {fastingGoals.monthly - fastingGoals.currentMonth > 0 
                ? `Faltam ${fastingGoals.monthly - fastingGoals.currentMonth} jejuns para a meta mensal!`
                : "🏆 Meta mensal conquistada!"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastingGoals;
