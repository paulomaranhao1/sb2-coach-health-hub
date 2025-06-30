
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOptimizedUserData } from './useOptimizedUserData';
import { useLogger } from '@/utils/logger';

export const useOptimizedGamification = () => {
  const { data, loading, updateUserStats, invalidateUserData } = useOptimizedUserData();
  const logger = useLogger('useOptimizedGamification');

  const addPoints = useCallback(async (points: number, message?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !data.stats) {
        logger.warn('No user or stats found for points addition');
        return;
      }

      const newPoints = data.stats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const today = new Date().toISOString().split('T')[0];

      // Atualização otimista (UI primeiro)
      updateUserStats({
        points: newPoints,
        level: Math.max(newLevel, data.stats.level),
        last_activity_date: today
      });

      // Depois atualizar no servidor
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: Math.max(newLevel, data.stats.level),
          shields: data.stats.shields,
          stickers: data.stats.stickers,
          streak: data.stats.streak,
          last_activity_date: today
        });

      if (error) throw error;

      if (message) {
        toast.success(message);
      }

      logger.info('Points added successfully', { newPoints, newLevel });
    } catch (error) {
      logger.error('Error adding points', { error });
      // Reverter mudança otimista em caso de erro
      invalidateUserData();
      toast.error('Erro ao adicionar pontos');
    }
  }, [data.stats, updateUserStats, invalidateUserData, logger]);

  const unlockShield = useCallback(async (shieldId: string) => {
    if (!data.stats || data.stats.shields.includes(shieldId)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newShields = [...data.stats.shields, shieldId];
      
      // Atualização otimista
      updateUserStats({ shields: newShields });

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: data.stats.points,
          level: data.stats.level,
          shields: newShields,
          stickers: data.stats.stickers,
          streak: data.stats.streak
        });

      if (error) throw error;

      toast.success(
        <div className="flex items-center gap-3">
          <div className="text-2xl">🛡️</div>
          <div>
            <div className="font-semibold text-sm">Novo Escudo Desbloqueado!</div>
            <div className="text-xs text-gray-600">Primeira Pesagem desbloqueada!</div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error unlocking shield:', error);
      invalidateUserData();
      toast.error('Erro ao desbloquear escudo');
    }
  }, [data.stats, updateUserStats, invalidateUserData]);

  const collectSticker = useCallback(async (stickerId: string) => {
    if (!data.stats || data.stats.stickers.includes(stickerId)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newStickers = [...data.stats.stickers, stickerId];
      
      // Atualização otimista
      updateUserStats({ stickers: newStickers });

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: data.stats.points,
          level: data.stats.level,
          shields: data.stats.shields,
          stickers: newStickers,
          streak: data.stats.streak
        });

      if (error) throw error;

      toast.success('⭐ Nova Figurinha Coletada!');
    } catch (error) {
      console.error('Error collecting sticker:', error);
      invalidateUserData();
      toast.error('Erro ao coletar figurinha');
    }
  }, [data.stats, updateUserStats, invalidateUserData]);

  // Verificar se pontos diários já foram coletados
  const dailyPointsClaimed = data.stats?.last_activity_date === new Date().toISOString().split('T')[0];

  return {
    userStats: data.stats,
    profile: data.profile,
    subscription: data.subscription,
    loading,
    dailyPointsClaimed,
    addPoints,
    unlockShield,
    collectSticker,
    refetch: invalidateUserData
  };
};
