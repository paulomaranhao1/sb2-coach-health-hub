
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserStats } from './useUserStats';

export const useAchievements = (userStats: UserStats, setUserStats: (stats: UserStats | ((prev: UserStats) => UserStats)) => void) => {
  const { toast } = useToast();

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
    unlockShield,
    collectSticker
  };
};
