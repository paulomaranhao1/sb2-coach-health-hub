
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  type: 'level' | 'shield' | 'points' | 'streak';
  title: string;
  description: string;
  points?: number;
}

export const useRealTimeAchievements = () => {
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  const checkAndAwardProgress = useCallback(async (
    actionType: 'weight' | 'fasting' | 'food',
    data?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userStats) return;

      const newAchievements: Achievement[] = [];

      // Check level achievements
      const newLevel = Math.floor(userStats.points / 100) + 1;
      if (newLevel > userStats.level) {
        newAchievements.push({
          id: `level_${newLevel}`,
          type: 'level',
          title: `Nível ${newLevel} Alcançado!`,
          description: `Parabéns! Você subiu para o nível ${newLevel}`,
          points: 0
        });
      }

      // Check streak achievements
      if (userStats.streak && userStats.streak > 0) {
        if (userStats.streak === 7) {
          newAchievements.push({
            id: 'streak_7',
            type: 'streak',
            title: 'Streak de 7 Dias!',
            description: 'Uma semana inteira de consistência! 🔥',
            points: 50
          });
        } else if (userStats.streak === 30) {
          newAchievements.push({
            id: 'streak_30',
            type: 'streak',
            title: 'Streak de 30 Dias!',
            description: 'Um mês inteiro! Você é incrível! 💎',
            points: 200
          });
        }
      }

      // Check specific action achievements
      if (actionType === 'weight') {
        // Get weight entries count
        const { data: weightEntries } = await supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id);

        if (weightEntries?.length === 1) {
          newAchievements.push({
            id: 'first_weight',
            type: 'shield',
            title: 'Primeira Pesagem!',
            description: 'Você registrou seu primeiro peso! 🏋️',
            points: 50
          });
        }
      }

      // Show achievements
      newAchievements.forEach(achievement => {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="font-semibold text-sm">{achievement.title}</div>
              <div className="text-xs text-gray-600">{achievement.description}</div>
              {achievement.points && achievement.points > 0 && (
                <div className="text-xs text-purple-600 font-medium">
                  +{achievement.points} pontos
                </div>
              )}
            </div>
          </div>,
          {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #f59e0b',
              color: '#92400e'
            }
          }
        );
      });

      setPendingAchievements(prev => [...prev, ...newAchievements]);

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }, []);

  const clearAchievement = useCallback((achievementId: string) => {
    setPendingAchievements(prev => 
      prev.filter(achievement => achievement.id !== achievementId)
    );
  }, []);

  return {
    pendingAchievements,
    checkAndAwardProgress,
    clearAchievement
  };
};
