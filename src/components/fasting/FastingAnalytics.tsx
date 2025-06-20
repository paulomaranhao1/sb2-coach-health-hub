
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target, Calendar, Clock, Flame } from "lucide-react";
import { FastingStats } from "@/hooks/useFasting";

interface FastingAnalyticsProps {
  stats: FastingStats;
}

const FastingAnalytics = ({ stats }: FastingAnalyticsProps) => {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "bg-gradient-to-r from-purple-500 to-pink-500";
    if (streak >= 14) return "bg-gradient-to-r from-blue-500 to-purple-500";
    if (streak >= 7) return "bg-gradient-to-r from-green-500 to-blue-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-blue-600";
    if (rate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const achievements = [
    { 
      title: "Primeiro Jejum", 
      unlocked: stats.completedSessions >= 1,
      icon: "🏁",
      description: "Complete seu primeiro jejum"
    },
    { 
      title: "Dedicado", 
      unlocked: stats.completedSessions >= 10,
      icon: "⭐",
      description: "Complete 10 jejuns"
    },
    { 
      title: "Mestre do Jejum", 
      unlocked: stats.completedSessions >= 50,
      icon: "🌟",
      description: "Complete 50 jejuns"
    },
    { 
      title: "Streak de Ferro", 
      unlocked: stats.currentStreak >= 7,
      icon: "🔥",
      description: "Mantenha 7 dias consecutivos"
    },
    { 
      title: "Consistência Diamante", 
      unlocked: stats.currentStreak >= 30,
      icon: "💎",
      description: "Mantenha 30 dias consecutivos"
    },
    { 
      title: "Maratonista", 
      unlocked: stats.longestFast >= 24,
      icon: "🏃‍♂️",
      description: "Complete um jejum de 24h+"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Streak Atual</p>
                <p className="text-2xl font-bold text-blue-700">{stats.currentStreak}</p>
                <p className="text-xs text-blue-500">dias consecutivos</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${getStreakColor(stats.currentStreak)} flex items-center justify-center`}>
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Taxa de Conclusão</p>
                <p className={`text-2xl font-bold ${getCompletionColor(stats.averageCompletion)}`}>
                  {stats.averageCompletion.toFixed(1)}%
                </p>
                <p className="text-xs text-green-500">jejuns completos</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Horas Totais</p>
                <p className="text-2xl font-bold text-purple-700">{stats.totalHoursFasted.toFixed(0)}h</p>
                <p className="text-xs text-purple-500">tempo jejuando</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Jejum Mais Longo</p>
                <p className="text-2xl font-bold text-orange-700">{stats.longestFast.toFixed(0)}h</p>
                <p className="text-xs text-orange-500">recorde pessoal</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Progresso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Média semanal</span>
                <span className="font-medium">{stats.weeklyAverage.toFixed(1)} jejuns</span>
              </div>
              <Progress value={Math.min(100, (stats.weeklyAverage / 7) * 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consistência</span>
                <span className="font-medium">{stats.averageCompletion.toFixed(0)}%</span>
              </div>
              <Progress value={stats.averageCompletion} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700' 
                      : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${achievement.unlocked ? 'text-green-800 dark:text-green-200' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500 text-white text-xs">Desbloqueado</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
              <p className="text-sm text-gray-600">Total de Jejuns</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
              <p className="text-sm text-gray-600">Jejuns Completos</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">{stats.longestStreak}</p>
              <p className="text-sm text-gray-600">Maior Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastingAnalytics;
