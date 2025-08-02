
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, TrendingUp, Clock, Heart } from "lucide-react";

interface FastingStatisticsProps {
  streakCount: number;
  completedFasts: number;
  successRate: number;
  totalHoursFasted: number;
  totalFasts: number;
}

const FastingStatistics = ({
  streakCount,
  completedFasts,
  successRate,
  totalHoursFasted,
  totalFasts
}: FastingStatisticsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardContent className="p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">{streakCount}</p>
          <p className="text-sm text-gray-600">Sequência</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{completedFasts}</p>
          <p className="text-sm text-gray-600">Jejuns Completos</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{successRate.toFixed(0)}%</p>
          <p className="text-sm text-gray-600">Taxa de Sucesso</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{totalHoursFasted.toFixed(0)}h</p>
          <p className="text-sm text-gray-600">Total Jejuado</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold">{totalFasts}</p>
          <p className="text-sm text-gray-600">Total Tentativas</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastingStatistics;
