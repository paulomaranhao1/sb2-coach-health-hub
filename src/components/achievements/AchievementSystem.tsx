
import React, { useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Zap, Award, Lock } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useLogger } from '@/utils/logger';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'weight' | 'fasting' | 'habit' | 'streak';
  requirement: number;
  points: number;
  unlocked: boolean;
  progress: number;
  dateUnlocked?: Date;
}

interface AchievementSystemProps {
  userStats?: any;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const AchievementSystem = memo(({ userStats, onAchievementUnlock }: AchievementSystemProps) => {
  const logger = useLogger('AchievementSystem');
  const { achievements, totalPoints, level, checkAchievements } = useAchievements();

  // Memoized achievement categories
  const achievementCategories = useMemo(() => {
    const categories = {
      weight: { name: 'Perda de Peso', icon: Target, color: 'bg-green-500' },
      fasting: { name: 'Jejum', icon: Zap, color: 'bg-blue-500' },
      habit: { name: 'Hábitos', icon: Award, color: 'bg-purple-500' },
      streak: { name: 'Sequências', icon: Trophy, color: 'bg-orange-500' }
    };

    return Object.entries(categories).map(([key, category]) => ({
      ...category,
      key,
      achievements: achievements.filter(a => a.category === key)
    }));
  }, [achievements]);

  // Memoized stats
  const stats = useMemo(() => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const completionRate = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

    return {
      unlockedCount,
      totalCount,
      completionRate,
      totalPoints,
      level
    };
  }, [achievements, totalPoints, level]);

  // Achievement unlock handler
  const handleAchievementClick = useCallback((achievement: Achievement) => {
    if (!achievement.unlocked) {
      logger.info('Achievement not yet unlocked', { 
        achievementId: achievement.id,
        progress: achievement.progress,
        requirement: achievement.requirement 
      });
      return;
    }

    logger.info('Achievement clicked', { achievementId: achievement.id });
    onAchievementUnlock?.(achievement);
  }, [onAchievementUnlock, logger]);

  // Progress bar component
  const ProgressBar = memo(({ progress, requirement }: { progress: number; requirement: number }) => {
    const percentage = Math.min(100, (progress / requirement) * 100);
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  });

  ProgressBar.displayName = 'ProgressBar';

  // Achievement card component
  const AchievementCard = memo(({ achievement }: { achievement: Achievement }) => {
    const IconComponent = achievement.unlocked ? Trophy : Lock;
    const isCompleted = achievement.unlocked;
    
    return (
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
          isCompleted ? 'ring-2 ring-primary' : 'opacity-75'
        }`}
        onClick={() => handleAchievementClick(achievement)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{achievement.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>
              
              {!isCompleted && (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{achievement.progress}/{achievement.requirement}</span>
                    <span>{achievement.points} pts</span>
                  </div>
                  <ProgressBar 
                    progress={achievement.progress} 
                    requirement={achievement.requirement} 
                  />
                </>
              )}
              
              {isCompleted && achievement.dateUnlocked && (
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {achievement.points} pontos
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {achievement.dateUnlocked.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });

  AchievementCard.displayName = 'AchievementCard';

  return (
    <GlobalErrorBoundary level="component" name="Achievement System">
      <div className="space-y-6">
        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.unlockedCount}</div>
                <div className="text-sm text-muted-foreground">Desbloqueadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalCount}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completionRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Pontos</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Geral</span>
                <span>{stats.completionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        {achievementCategories.map((category) => (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${category.color} text-white`}>
                  <category.icon className="w-4 h-4" />
                </div>
                {category.name}
                <Badge variant="secondary">
                  {category.achievements.filter(a => a.unlocked).length}/{category.achievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {category.achievements.map((achievement) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                  />
                ))}
              </div>
              
              {category.achievements.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conquista disponível nesta categoria</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={() => {
              logger.info('Checking for new achievements');
              checkAchievements(userStats);
            }}
            variant="outline"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Verificar Conquistas
          </Button>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
});

AchievementSystem.displayName = 'AchievementSystem';

export default AchievementSystem;
