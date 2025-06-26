
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, TrendingUp } from "lucide-react";

interface WelcomeSectionProps {
  userProfile: any;
  userStats: any;
  weightEntries: any[];
}

const WelcomeSection = ({ userProfile, userStats, weightEntries }: WelcomeSectionProps) => {
  const getWelcomeMessage = () => {
    const name = userProfile?.name || 'Usuário';
    const hour = new Date().getHours();
    
    if (hour < 12) return `Bom dia, ${name}! 🌅`;
    if (hour < 18) return `Boa tarde, ${name}! ☀️`;
    return `Boa noite, ${name}! 🌙`;
  };

  const getMotivationalMessage = () => {
    if (!userStats) return "Comece sua jornada hoje!";
    
    const { points, streak, level } = userStats;
    
    if (streak >= 7) return `Incrível! ${streak} dias de consistência! 🔥`;
    if (points >= 100) return `Nível ${level}! Você está evoluindo! 🚀`;
    if (weightEntries.length >= 5) return "Você está no caminho certo! 💪";
    return "Continue firme na sua jornada! 🎯";
  };

  const getStreakMessage = () => {
    const streak = userStats?.streak || 0;
    if (streak === 0) return "Comece seu streak hoje!";
    if (streak === 1) return "Primeiro dia! Continue amanhã! 💪";
    if (streak < 7) return `${streak} dias seguidos! Rumo aos 7! 🔥`;
    if (streak < 30) return `${streak} dias! Você é incrível! 🏆`;
    return `${streak} dias! Você é uma inspiração! 👑`;
  };

  return (
    <div className="space-y-4">
      {/* Main Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">
            {getWelcomeMessage()}
          </CardTitle>
          <CardDescription className="text-blue-600 text-lg">
            {getMotivationalMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Nível {userStats?.level || 1}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {userStats?.points || 0} pontos
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {weightEntries.length} registros
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      {(userStats?.streak || 0) > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-orange-800">Streak Ativo! 🔥</p>
                <p className="text-sm text-orange-600">{getStreakMessage()}</p>
              </div>
              <div className="text-3xl font-bold text-orange-700">
                {userStats.streak}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomeSection;
