
import UserStatsCard from './gamification/UserStatsCard';
import ShieldsCollection from './gamification/ShieldsCollection';
import StickersAlbum from './gamification/StickersAlbum';
import TestActions from './gamification/TestActions';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/hooks/use-toast';

const GamificationSystem = () => {
  const { 
    userStats, 
    loading, 
    dailyPointsClaimed, 
    addPoints, 
    unlockShield, 
    collectSticker 
  } = useGamification();
  const { toast } = useToast();

  const shields = [
    { id: 'first_weight', name: 'Primeira Pesagem', emoji: '⚖️', description: 'Registrou seu primeiro peso' },
    { id: 'week_streak', name: 'Semana Consistente', emoji: '🔥', description: '7 dias seguidos de uso' },
    { id: 'goal_achiever', name: 'Conquistador', emoji: '🎯', description: 'Atingiu uma meta de peso' },
    { id: 'supplement_master', name: 'Mestre dos Suplementos', emoji: '💊', description: '30 dias tomando suplemento' },
    { id: 'warrior', name: 'Guerreiro', emoji: '⚔️', description: 'Perdeu 5kg do peso inicial' },
    { id: 'persistent', name: 'Persistente', emoji: '📈', description: '15 dias seguidos de registro' },
    { id: 'transformer', name: 'Transformador', emoji: '🦋', description: 'Perdeu 10kg do peso inicial' },
    { id: 'disciplined', name: 'Disciplinado', emoji: '🎖️', description: 'Atingiu 500 pontos' },
    { id: 'champion', name: 'Campeão', emoji: '🏆', description: '30 dias seguidos de registro' },
    { id: 'legend', name: 'Lenda', emoji: '👑', description: '100 dias seguidos de registro' },
    { id: 'master', name: 'Mestre', emoji: '🧙‍♂️', description: 'Atingiu 1000 pontos' },
    { id: 'phoenix', name: 'Fênix', emoji: '🔥', description: 'Perdeu 15kg do peso inicial' },
    { id: 'titan', name: 'Titã', emoji: '⚡', description: 'Perdeu 20kg do peso inicial' },
    { id: 'immortal', name: 'Imortal', emoji: '💎', description: '365 dias seguidos de registro' }
  ];

  const stickers = [
    { id: 'motivated', name: 'Motivado', emoji: '💪', rarity: 'comum' },
    { id: 'focused', name: 'Focado', emoji: '🎯', rarity: 'comum' },
    { id: 'energetic', name: 'Energético', emoji: '⚡', rarity: 'comum' },
    { id: 'determined', name: 'Determinado', emoji: '🔥', rarity: 'comum' },
    { id: 'strong', name: 'Forte', emoji: '💥', rarity: 'comum' },
    { id: 'champion', name: 'Campeão', emoji: '🏆', rarity: 'raro' },
    { id: 'warrior', name: 'Guerreiro', emoji: '⚔️', rarity: 'raro' },
    { id: 'beast', name: 'Fera', emoji: '🦁', rarity: 'raro' },
    { id: 'machine', name: 'Máquina', emoji: '🤖', rarity: 'raro' },
    { id: 'unstoppable', name: 'Imparável', emoji: '🚀', rarity: 'raro' },
    { id: 'legend', name: 'Lenda', emoji: '👑', rarity: 'épico' },
    { id: 'godlike', name: 'Divino', emoji: '✨', rarity: 'épico' },
    { id: 'mythical', name: 'Mítico', emoji: '🌟', rarity: 'épico' },
    { id: 'immortal', name: 'Imortal', emoji: '💎', rarity: 'épico' },
    { id: 'transcendent', name: 'Transcendente', emoji: '🌈', rarity: 'lendário' },
    { id: 'ultimate', name: 'Supremo', emoji: '🔮', rarity: 'lendário' }
  ];

  const shareSticker = async (stickerId: string) => {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;

    try {
      const shareData = {
        title: 'SB2FIT - Conquista Desbloqueada!',
        text: `Acabei de conquistar a figurinha ${sticker.emoji} ${sticker.name} no SB2FIT!`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "Cole onde quiser compartilhar sua conquista"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserStatsCard userStats={userStats} />
      <ShieldsCollection shields={shields} userShields={userStats.shields} />
      <StickersAlbum 
        stickers={stickers} 
        userStickers={userStats.stickers} 
        onShareSticker={shareSticker} 
      />
      <TestActions
        onAddPoints={() => addPoints(10, "Peso registrado!")}
        onUnlockShield={() => unlockShield('first_weight')}
        onCollectSticker={() => collectSticker('motivated')}
        dailyPointsClaimed={dailyPointsClaimed}
      />
    </div>
  );
};

export default GamificationSystem;
