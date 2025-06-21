
import { Card, CardContent } from "@/components/ui/card";
import { FastingStats } from "@/hooks/useFasting";

interface FastingOverviewTabProps {
  stats: FastingStats;
}

const FastingOverviewTab = ({ stats }: FastingOverviewTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
          <div className="text-sm text-blue-500">Streak Atual</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completedSessions}</div>
          <div className="text-sm text-green-500">Jejuns Completos</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalHoursFasted.toFixed(0)}h</div>
          <div className="text-sm text-purple-500">Horas Totais</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.averageCompletion.toFixed(0)}%</div>
          <div className="text-sm text-orange-500">Taxa Sucesso</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastingOverviewTab;
