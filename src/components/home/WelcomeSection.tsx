
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, TrendingUp, Target } from "lucide-react";

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
    if (!userStats) return "Que tal começar sua transformação hoje?";
    
    const { points, streak, level } = userStats;
    
    if (streak >= 7) return `Fantástico! ${streak} dias consecutivos de dedicação! 🔥`;
    if (points >= 100) return `Nível ${level} desbloqueado! Você está arrasando! 🚀`;
    if (weightEntries.length >= 5) return "Sua consistência está impressionante! 💪";
    return "Cada passo conta na sua jornada! 🎯";
  };

  const getSequenceMessage = () => {
    const sequence = userStats?.streak || 0;
    if (sequence === 0) return "Comece sua sequência de sucesso hoje!";
    if (sequence === 1) return "Primeiro dia conquistado! Vamos para o segundo! 💪";
    if (sequence < 7) return `${sequence} dias seguidos! Você está criando um hábito incrível! 🔥`;
    if (sequence < 30) return `${sequence} dias consecutivos! Você é uma inspiração! 🏆`;
    return `${sequence} dias seguidos! Você é imparável! 👑`;
  };

  return (
    <div className="space-y-6">
      {/* Main Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">
            {getWelcomeMessage()}
          </CardTitle>
          <CardDescription className="text-blue-100 text-xl font-medium">
            {getMotivationalMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 flex items-center gap-2 px-4 py-2">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">Nível {userStats?.level || 1}</span>
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 flex items-center gap-2 px-4 py-2">
              <Target className="w-4 h-4" />
              <span className="font-semibold">{userStats?.points || 0} pontos</span>
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 flex items-center gap-2 px-4 py-2">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">{weightEntries.length} registros</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sequence Card */}
      {(userStats?.streak || 0) > 0 && (
        <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <p className="text-xl font-bold">Sequência Ativa! 🔥</p>
                </div>
                <p className="text-orange-100 text-lg">{getSequenceMessage()}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-orange-100">dias seguidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomeSection;
