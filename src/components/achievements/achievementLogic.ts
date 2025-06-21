
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from './achievementData';

export interface UserStats {
  points: number;
  level: number;
  achievements: string[];
  totalWeightEntries: number;
  totalFastingSessions: number;
  totalCaloriePhotos: number;
  streak: number;
}

export const loadUserData = async (): Promise<UserStats | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Carregar estatísticas do usuário
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Carregar dados de peso
    const { data: weightEntries } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    // Carregar dados de jejum
    const { data: fastingSessions } = await supabase
      .from('fasting_sessions')
      .select('*')
      .eq('user_id', user.id);

    // Carregar dados de calorias
    const { data: calorieAnalyses } = await supabase
      .from('food_analyses')
      .select('*')
      .eq('user_id', user.id);

    if (stats) {
      return {
        points: stats.points || 0,
        level: stats.level || 1,
        achievements: stats.shields || [],
        totalWeightEntries: weightEntries?.length || 0,
        totalFastingSessions: fastingSessions?.filter(f => f.completed)?.length || 0,
        totalCaloriePhotos: calorieAnalyses?.length || 0,
        streak: stats.streak || 0
      };
    }

    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const checkAchievementCondition = (achievement: Achievement, userStats: UserStats): boolean => {
  switch (achievement.id) {
    case 'first_weight':
      return userStats.totalWeightEntries >= 1;
    case 'weight_streak_7':
      return userStats.streak >= 7;
    case 'weight_streak_30':
      return userStats.streak >= 30;
    case 'weight_streak_90':
      return userStats.streak >= 90;
    case 'weight_loss_1kg':
      return true; // Implementar lógica de verificação
    case 'weight_loss_5kg':
      return true; // Implementar lógica de verificação
    case 'weight_loss_10kg':
      return true; // Implementar lógica de verificação
    case 'first_fast':
      return userStats.totalFastingSessions >= 1;
    case 'fast_12h':
      return true; // Implementar lógica de verificação
    case 'fast_16h':
      return true; // Implementar lógica de verificação
    case 'fast_24h':
      return true; // Implementar lógica de verificação
    case 'fast_48h':
      return true; // Implementar lógica de verificação
    case 'fast_week':
      return true; // Implementar lógica de verificação
    case 'fast_month':
      return true; // Implementar lógica de verificação
    case 'first_photo':
      return userStats.totalCaloriePhotos >= 1;
    case 'photo_streak_7':
      return true; // Implementar lógica de verificação
    case 'photo_streak_30':
      return true; // Implementar lógica de verificação
    case 'calories_tracked_1000':
      return true; // Implementar lógica de verificação
    case 'calories_tracked_5000':
      return true; // Implementar lógica de verificação
    case 'calories_tracked_10000':
      return true; // Implementar lógica de verificação
    case 'points_500':
      return userStats.points >= 500;
    case 'points_1000':
      return userStats.points >= 1000;
    case 'points_2500':
      return userStats.points >= 2500;
    case 'level_5':
      return userStats.level >= 5;
    case 'level_10':
      return userStats.level >= 10;
    case 'level_25':
      return userStats.level >= 25;
    case 'completionist':
      return userStats.achievements.length >= 10;
    case 'perfectionist':
      return userStats.achievements.length >= 20;
    default:
      return false;
  }
};

export const saveNewAchievements = async (newAchievements: Achievement[], userStats: UserStats): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const newAchievementIds = newAchievements.map(a => a.id);
    const totalPoints = newAchievements.reduce((sum, a) => sum + a.points, 0);
    
    const { error } = await supabase
      .from('user_stats')
      .update({
        shields: [...userStats.achievements, ...newAchievementIds],
        points: userStats.points + totalPoints,
        level: Math.floor((userStats.points + totalPoints) / 100) + 1
      })
      .eq('user_id', user.id);

    return !error;
  } catch (error) {
    console.error('Error saving achievements:', error);
    return false;
  }
};

export const getLevelProgress = (userStats: UserStats) => {
  const currentLevelPoints = (userStats.level - 1) * 100;
  const nextLevelPoints = userStats.level * 100;
  const progressInLevel = userStats.points - currentLevelPoints;
  const progressPercentage = (progressInLevel / 100) * 100;
  
  return {
    current: progressInLevel,
    total: 100,
    percentage: Math.min(progressPercentage, 100)
  };
};
