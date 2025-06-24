
import React, { useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Zap, Award, Lock } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useLogger } from '@/utils/logger';
import { useAccessibility } from '@/hooks/useAccessibility';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { ScreenReaderAnnouncer } from '@/components/ui/screen-reader-announcer';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { SkeletonCard, SkeletonList } from '@/components/ui/skeleton-loader';
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
  const { userProgress, loading, checkAchievement, awardPoints } = useAchievements();
  
  const { containerRef, announce, announcements } = useAccessibility({
    announceChanges: true,
    enableKeyboardNavigation: true
  });

  // Mock achievements data for now since useAchievements doesn't provide it
  const mockAchievements: Achievement[] = useMemo(() => [
    {
      id: 'first_weight',
      name: 'Primeira Pesagem',
      description: 'Registrou seu primeiro peso',
      icon: 'trophy',
      category: 'weight',
      requirement: 1,
      points: 10,
      unlocked: true,
      progress: 1
    },
    {
      id: 'weight_loss_5kg',
      name: 'Perdeu 5kg',
      description: 'Perdeu 5kg do peso inicial',
      icon: 'target',
      category: 'weight',
      requirement: 5,
      points: 50,
      unlocked: false,
      progress: 2
    },
    {
      id: 'fasting_streak_7',
      name: 'Jejum 7 dias',
      description: 'Completou jejum por 7 dias seguidos',
      icon: 'zap',
      category: 'fasting',
      requirement: 7,
      points: 35,
      unlocked: false,
      progress: 3
    }
  ], []);

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
      achievements: mockAchievements.filter(a => a.category === key)
    }));
  }, [mockAchievements]);

  // Memoized stats - use userProgress from hook or fallback to defaults
  const stats = useMemo(() => {
    const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
    const totalCount = mockAchievements.length;
    const completionRate = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
    // Get points from userProgress, but it doesn't have these properties, so calculate from achievements
    const totalPoints = mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
    const level = Math.floor(totalPoints / 100) + 1;

    return {
      unlockedCount,
      totalCount,
      completionRate,
      totalPoints,
      level
    };
  }, [mockAchievements, userProgress]);

  // Achievement unlock handler with accessibility
  const handleAchievementClick = useCallback((achievement: Achievement) => {
    if (!achievement.unlocked) {
      logger.info('Achievement not yet unlocked', { 
        achievementId: achievement.id,
        progress: achievement.progress,
        requirement: achievement.requirement 
      });
      announce(`Conquista bloqueada: ${achievement.name}. Progresso: ${achievement.progress} de ${achievement.requirement}`);
      return;
    }

    logger.info('Achievement clicked', { achievementId: achievement.id });
    announce(`Conquista desbloqueada: ${achievement.name}. ${achievement.points} pontos ganhos.`);
    enhancedToast.success('Conquista desbloqueada!', {
      description: `${achievement.name} - ${achievement.points} pontos`
    });
    onAchievementUnlock?.(achievement);
  }, [onAchievementUnlock, logger, announce]);

  // Progress bar component
  const ProgressBar = memo(({ progress, requirement }: { progress: number; requirement: number }) => {
    const percentage = Math.min(100, (progress / requirement) * 100);
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={requirement}
          aria-label={`Progresso: ${progress} de ${requirement}`}
        />
      </div>
    );
  });

  ProgressBar.displayName = 'ProgressBar';

  // Achievement card component with accessibility
  const AchievementCard = memo(({ achievement }: { achievement: Achievement }) => {
    const IconComponent = achievement.unlocked ? Trophy : Lock;
    const isCompleted = achievement.unlocked;
    
    return (
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:scale-105 focus-within:ring-2 focus-within:ring-primary ${
          isCompleted ? 'ring-2 ring-primary' : 'opacity-75'
        }`}
        onClick={() => handleAchievementClick(achievement)}
        role="button"
        tabIndex={0}
        aria-pressed={isCompleted}
        aria-describedby={`achievement-${achievement.id}-desc`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAchievementClick(achievement);
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <IconComponent className="w-5 h-5" aria-hidden="true" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{achievement.name}</h4>
              <p 
                id={`achievement-${achievement.id}-desc`}
                className="text-sm text-muted-foreground line-clamp-2"
              >
                {achievement.description}
              </p>
              
              {!isCompleted && (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span aria-label={`Progresso: ${achievement.progress} de ${achievement.requirement}`}>
                      {achievement.progress}/{achievement.requirement}
                    </span>
                    <span aria-label={`Recompensa: ${achievement.points} pontos`}>
                      {achievement.points} pts
                    </span>
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

  if (loading) {
    return <SkeletonList items={3} />;
  }

  return (
    <GlobalErrorBoundary level="component" name="Achievement System">
      <div ref={containerRef} className="space-y-6">
        <ScreenReaderAnnouncer announcements={announcements} />
        
        {/* Stats Overview */}
        <Card role="region" aria-labelledby="achievements-overview">
          <CardHeader>
            <CardTitle 
              id="achievements-overview"
              className="flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" aria-hidden="true" />
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
                  role="progressbar"
                  aria-valuenow={stats.completionRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso geral das conquistas: ${stats.completionRate.toFixed(1)}%`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        {achievementCategories.map((category) => (
          <Card key={category.key} role="region" aria-labelledby={`category-${category.key}`}>
            <CardHeader>
              <CardTitle 
                id={`category-${category.key}`}
                className="flex items-center gap-2"
              >
                <div className={`p-2 rounded-full ${category.color} text-white`}>
                  <category.icon className="w-4 h-4" aria-hidden="true" />
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
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p>Nenhuma conquista disponível nesta categoria</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Action Button */}
        <div className="text-center">
          <AccessibleButton 
            onClick={() => {
              logger.info('Checking for new achievements');
              checkAchievement('manual_check', true);
              announce('Verificando novas conquistas disponíveis');
              enhancedToast.info('Verificando conquistas...', {
                description: 'Analisando seu progresso'
              });
            }}
            variant="outline"
            aria-label="Verificar se há novas conquistas disponíveis"
          >
            <Trophy className="w-4 h-4 mr-2" aria-hidden="true" />
            Verificar Conquistas
          </AccessibleButton>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
});

AchievementSystem.displayName = 'AchievementSystem';

export default AchievementSystem;
