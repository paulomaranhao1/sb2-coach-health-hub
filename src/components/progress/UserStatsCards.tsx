
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Activity } from "lucide-react";
import ErrorBoundary from "../error/ErrorBoundary";
import StatsSkeleton from "../ui/skeletons/StatsSkeleton";

interface UserStatsCardsProps {
  userStats: any;
  weightHistoryLength: number;
  consistencyScore: string;
  avgWeightLossPerWeek: string;
  loading?: boolean;
}

const UserStatsCards = ({ 
  userStats, 
  weightHistoryLength, 
  consistencyScore, 
  avgWeightLossPerWeek,
  loading = false
}: UserStatsCardsProps) => {
  if (loading) {
    return <StatsSkeleton />;
  }

  if (!userStats) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Trophy className="w-5 h-5" />
              Nível {userStats.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-800">{userStats.points} pontos</p>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 rounded-full h-2 transition-all"
                  style={{ width: `${(userStats.points % 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{100 - (userStats.points % 100)} pontos para próximo nível</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Award className="w-5 h-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-800">{userStats.shields?.length || 0} escudos</p>
              <p className="text-2xl font-bold text-blue-800">{userStats.stickers?.length || 0} figurinhas</p>
              <Badge className="bg-blue-100 text-blue-800">
                {userStats.streak || 0} dias seguidos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Activity className="w-5 h-5" />
              Atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-800">{weightHistoryLength} registros</p>
              <p className="text-sm text-green-600">Consistência: {consistencyScore}%</p>
              <Badge className="bg-green-100 text-green-800">
                {avgWeightLossPerWeek}kg/semana
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default UserStatsCards;
