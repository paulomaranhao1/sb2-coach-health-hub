
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserStats {
  points: number;
  level: number;
  shields: string[];
  stickers: string[];
  streak: number;
  last_activity_date?: string;
}

export const useGamification = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    shields: [],
    stickers: [],
    streak: 0
  });
  const [loading, setLoading] = useState(true);
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user stats:', error);
        return;
      }

      if (data) {
        setUserStats({
          points: data.points || 0,
          level: data.level || 1,
          shields: data.shields || [],
          stickers: data.stickers || [],
          streak: data.streak || 0,
          last_activity_date: data.last_activity_date
        });

        const today = new Date().toISOString().split('T')[0];
        const lastActivityDate = data.last_activity_date;
        setDailyPointsClaimed(lastActivityDate === today);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (dailyPointsClaimed) {
        toast({
          title: "Você já coletou seus pontos hoje! 🎯",
          description: "Volte amanhã para coletar mais pontos e continuar sua jornada!",
          variant: "default"
        });
        return;
      }

      const newPoints = userStats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: userStats.shields,
          stickers: userStats.stickers,
          streak: userStats.streak,
          last_activity_date: today
        });

      if (error) {
        console.error('Error adding points:', error);
        toast({
          title: "Você já coletou seus pontos hoje! 🎯",
          description: "Volte amanhã para coletar mais pontos e continuar sua jornada!",
          variant: "default"
        });
        return;
      }

      setUserStats(prev => ({ ...prev, points: newPoints, level: newLevel, last_activity_date: today }));
      setDailyPointsClaimed(true);
      
      toast({
        title: `+${points} pontos! 🎉`,
        description: reason
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Você já coletou seus pontos hoje! 🎯",
        description: "Volte amanhã para coletar mais pontos e continuar sua jornada!",
        variant: "default"
      });
    }
  };

  const unlockShield = async (shieldId: string) => {
    if (userStats.shields.includes(shieldId)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newShields = [...userStats.shields, shieldId];
      
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: userStats.points,
          level: userStats.level,
          shields: newShields,
          stickers: userStats.stickers,
          streak: userStats.streak
        });

      if (error) throw error;

      setUserStats(prev => ({ ...prev, shields: newShields }));
      
      toast({
        title: "🛡️ Novo Escudo Desbloqueado!",
        description: `Primeira Pesagem desbloqueada!`
      });
    } catch (error) {
      console.error('Error unlocking shield:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desbloquear o escudo",
        variant: "destructive"
      });
    }
  };

  const collectSticker = async (stickerId: string) => {
    if (userStats.stickers.includes(stickerId)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newStickers = [...userStats.stickers, stickerId];
      
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: userStats.points,
          level: userStats.level,
          shields: userStats.shields,
          stickers: newStickers,
          streak: userStats.streak
        });

      if (error) throw error;

      setUserStats(prev => ({ ...prev, stickers: newStickers }));
      
      toast({
        title: "⭐ Nova Figurinha Coletada!",
        description: `💪 Motivado coletada!`
      });
    } catch (error) {
      console.error('Error collecting sticker:', error);
      toast({
        title: "Erro",
        description: "Não foi possível coletar a figurinha",
        variant: "destructive"
      });
    }
  };

  return {
    userStats,
    loading,
    dailyPointsClaimed,
    addPoints,
    unlockShield,
    collectSticker
  };
};
