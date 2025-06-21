
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'weight' | 'fasting' | 'calories' | 'general';
  points: number;
  requirement: string;
  isUnlocked: boolean;
}

export interface UserProgress {
  totalWeightEntries: number;
  totalFastingSessions: number;
  totalCaloriePhotos: number;
  totalCaloriesTracked: number;
  weightLoss: number;
  longestStreak: number;
  currentStreak: number;
  longestFast: number;
}

export const useAchievements = () => {
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalWeightEntries: 0,
    totalFastingSessions: 0,
    totalCaloriePhotos: 0,
    totalCaloriesTracked: 0,
    weightLoss: 0,
    longestStreak: 0,
    currentStreak: 0,
    longestFast: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Dados de peso
      const { data: weightEntries } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      // Dados de jejum
      const { data: fastingSessions } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id);

      // Dados de calorias
      const { data: calorieAnalyses } = await supabase
        .from('food_analyses')
        .select('*')
        .eq('user_id', user.id);

      // Estatísticas do usuário
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Calcular perda de peso
      let weightLoss = 0;
      if (weightEntries && weightEntries.length > 1) {
        const firstWeight = weightEntries[0].weight;
        const lastWeight = weightEntries[weightEntries.length - 1].weight;
        weightLoss = firstWeight - lastWeight;
      }

      // Calcular jejum mais longo
      let longestFast = 0;
      if (fastingSessions) {
        longestFast = Math.max(...fastingSessions.map(f => f.duration || 0));
      }

      // Calcular total de calorias monitoradas
      let totalCaloriesTracked = 0;
      if (calorieAnalyses) {
        totalCaloriesTracked = calorieAnalyses.reduce((sum, analysis) => sum + (analysis.total_calories || 0), 0);
      }

      setUserProgress({
        totalWeightEntries: weightEntries?.length || 0,
        totalFastingSessions: fastingSessions?.filter(f => f.completed)?.length || 0,
        totalCaloriePhotos: calorieAnalyses?.length || 0,
        totalCaloriesTracked,
        weightLoss: Math.max(weightLoss, 0),
        longestStreak: userStats?.streak || 0,
        currentStreak: userStats?.streak || 0,
        longestFast
      });

    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievement = async (achievementId: string, condition: boolean) => {
    if (!condition) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: userStats } = await supabase
        .from('user_stats')
        .select('shields')
        .eq('user_id', user.id)
        .single();

      const currentAchievements = userStats?.shields || [];
      
      if (currentAchievements.includes(achievementId)) {
        return false; // Já desbloqueada
      }

      return true; // Nova conquista!
    } catch (error) {
      console.error('Error checking achievement:', error);
      return false;
    }
  };

  const awardPoints = async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const currentPoints = userStats?.points || 0;
      const newPoints = currentPoints + points;
      const newLevel = Math.floor(newPoints / 100) + 1;

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: userStats?.shields || [],
          stickers: userStats?.stickers || [],
          streak: userStats?.streak || 0
        });

      if (!error) {
        toast({
          title: `+${points} pontos! 🎉`,
          description: reason
        });
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  return {
    userProgress,
    loading,
    checkAchievement,
    awardPoints,
    refreshProgress: loadUserProgress
  };
};
