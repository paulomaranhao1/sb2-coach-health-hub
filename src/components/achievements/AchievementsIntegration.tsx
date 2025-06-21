
import { useEffect } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AchievementsIntegrationProps {
  onWeightEntry?: () => void;
  onFastingComplete?: (duration: number) => void;
  onCaloriePhotoAnalyzed?: (calories: number) => void;
}

const AchievementsIntegration = ({ 
  onWeightEntry, 
  onFastingComplete, 
  onCaloriePhotoAnalyzed 
}: AchievementsIntegrationProps) => {
  const { userProgress, checkAchievement, awardPoints } = useAchievements();
  const { toast } = useToast();

  // Verificar conquistas quando dados mudam
  useEffect(() => {
    checkAllAchievements();
  }, [userProgress]);

  const checkAllAchievements = async () => {
    const achievements = [
      {
        id: 'first_weight',
        condition: userProgress.totalWeightEntries >= 1,
        points: 50,
        message: 'Primeira pesagem registrada!'
      },
      {
        id: 'weight_streak_7',
        condition: userProgress.currentStreak >= 7,
        points: 100,
        message: '7 dias seguidos registrando peso!'
      },
      {
        id: 'weight_loss_1kg',
        condition: userProgress.weightLoss >= 1,
        points: 150,
        message: 'Parabéns! Você perdeu 1kg!'
      },
      {
        id: 'weight_loss_5kg',
        condition: userProgress.weightLoss >= 5,
        points: 500,
        message: 'Incrível! Você perdeu 5kg!'
      },
      {
        id: 'first_fast',
        condition: userProgress.totalFastingSessions >= 1,
        points: 75,
        message: 'Primeiro jejum completado!'
      },
      {
        id: 'fast_12h',
        condition: userProgress.longestFast >= 12 * 60 * 60,
        points: 100,
        message: 'Jejum de 12 horas completado!'
      },
      {
        id: 'fast_16h',
        condition: userProgress.longestFast >= 16 * 60 * 60,
        points: 150,
        message: 'Jejum de 16 horas completado!'
      },
      {
        id: 'first_photo',
        condition: userProgress.totalCaloriePhotos >= 1,
        points: 50,
        message: 'Primeira foto analisada!'
      },
      {
        id: 'calories_tracked_1000',
        condition: userProgress.totalCaloriesTracked >= 1000,
        points: 75,
        message: '1000 calorias monitoradas!'
      }
    ];

    for (const achievement of achievements) {
      const isNew = await checkAchievement(achievement.id, achievement.condition);
      if (isNew) {
        await unlock Achievement(achievement.id, achievement.points, achievement.message);
      }
    }
  };

  const unlockAchievement = async (achievementId: string, points: number, message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const currentAchievements = userStats?.shields || [];
      const newAchievements = [...currentAchievements, achievementId];
      const newPoints = (userStats?.points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1;

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: newAchievements,
          stickers: userStats?.stickers || [],
          streak: userStats?.streak || 0
        });

      if (!error) {
        toast({
          title: '🏆 Nova Conquista Desbloqueada!',
          description: `${message} (+${points} pontos)`
        });
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  // Este componente não renderiza nada, apenas gerencia as conquistas
  return null;
};

export default AchievementsIntegration;
