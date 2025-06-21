
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Zap } from 'lucide-react';

interface UserStats {
  points: number;
  level: number;
  achievements: string[];
  totalWeightEntries: number;
  totalFastingSessions: number;
  totalCaloriePhotos: number;
  streak: number;
}

interface AchievementHeaderProps {
  userStats: UserStats;
  totalAchievements: number;
  unlockedAchievements: number;
  completionPercentage: number;
  levelProgress: {
    current: number;
    total: number;
    percentage: number;
  };
}

const AchievementHeader = ({ 
  userStats, 
  totalAchievements, 
  unlockedAchievements, 
  completionPercentage, 
  levelProgress 
}: AchievementHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Sistema de Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <Crown className="w-6 h-6" />
              {userStats.level}
            </div>
            <div className="text-sm opacity-90">Nível</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <Zap className="w-6 h-6" />
              {userStats.points}
            </div>
            <div className="text-sm opacity-90">Pontos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{unlockedAchievements}/{totalAchievements}</div>
            <div className="text-sm opacity-90">Conquistas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
            <div className="text-sm opacity-90">Completo</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso do Nível {userStats.level}</span>
              <span>{levelProgress.current}/{levelProgress.total} pontos</span>
            </div>
            <Progress value={levelProgress.percentage} className="bg-red-400/30" />
            <div className="text-xs opacity-75 mt-1 text-center">
              {100 - levelProgress.current} pontos para o próximo nível
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso Geral</span>
              <span>{unlockedAchievements}/{totalAchievements}</span>
            </div>
            <Progress value={completionPercentage} className="bg-red-400/30" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementHeader;
