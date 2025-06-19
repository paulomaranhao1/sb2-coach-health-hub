import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Star, Gift, Share2, Zap } from 'lucide-react';

interface UserStats {
  points: number;
  level: number;
  shields: string[];
  stickers: string[];
  streak: number;
}

const GamificationSystem = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    shields: [],
    stickers: [],
    streak: 0
  });
  const [loading, setLoading] = useState(true);
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
          streak: data.streak || 0
        });
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

      const newPoints = userStats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: userStats.shields,
          stickers: userStats.stickers,
          streak: userStats.streak
        });

      if (error) throw error;

      setUserStats(prev => ({ ...prev, points: newPoints, level: newLevel }));
      
      toast({
        title: `+${points} pontos!`,
        description: reason
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar pontos",
        variant: "destructive"
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
      
      const shield = shields.find(s => s.id === shieldId);
      toast({
        title: "🛡️ Novo Escudo Desbloqueado!",
        description: `${shield?.emoji} ${shield?.name}`
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
      
      const sticker = stickers.find(s => s.id === stickerId);
      toast({
        title: "⭐ Nova Figurinha Coletada!",
        description: `${sticker?.emoji} ${sticker?.name}`
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comum': return 'bg-gray-100 text-gray-800';
      case 'raro': return 'bg-blue-100 text-blue-800';
      case 'épico': return 'bg-purple-100 text-purple-800';
      case 'lendário': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Status do Usuário */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Nível {userStats.level}
          </CardTitle>
          <CardDescription className="text-red-100">
            {userStats.points} pontos • {userStats.shields.length} escudos • {userStats.stickers.length} figurinhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-red-400/30 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${(userStats.points % 100)}%` }}
                />
              </div>
              <p className="text-sm text-red-100 mt-1">
                {100 - (userStats.points % 100)} pontos para o próximo nível
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userStats.streak}</div>
              <div className="text-sm text-red-100">dias seguidos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escudos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛡️ Coleção de Escudos
          </CardTitle>
          <CardDescription>
            Desbloqueie escudos completando desafios especiais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {shields.map((shield) => {
              const isUnlocked = userStats.shields.includes(shield.id);
              return (
                <div 
                  key={shield.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isUnlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2 text-center">{shield.emoji}</div>
                  <h3 className="font-semibold text-center mb-1">{shield.name}</h3>
                  <p className="text-xs text-gray-600 text-center">{shield.description}</p>
                  {isUnlocked && (
                    <Badge className="w-full mt-2 bg-green-600 text-white justify-center">
                      Desbloqueado
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Figurinhas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Álbum de Figurinhas
          </CardTitle>
          <CardDescription>
            Colecione figurinhas épicas e compartilhe suas conquistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stickers.map((sticker) => {
              const isCollected = userStats.stickers.includes(sticker.id);
              return (
                <div 
                  key={sticker.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCollected 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2 text-center">{sticker.emoji}</div>
                  <h3 className="font-semibold text-center mb-1">{sticker.name}</h3>
                  <Badge className={`w-full mb-2 justify-center ${getRarityColor(sticker.rarity)}`}>
                    {sticker.rarity}
                  </Badge>
                  {isCollected ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => shareSticker(sticker.id)}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartilhar
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full opacity-50"
                      disabled
                    >
                      Não coletada
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Laboratório de Conquistas */}
      <Card className="border-2 border-dashed border-yellow-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Laboratório de Conquistas
          </CardTitle>
          <CardDescription>
            Experimente desbloquear conquistas para testar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={() => addPoints(10, "Peso registrado!")} className="w-full">
            <Gift className="w-4 h-4 mr-2" />
            Ganhar 10 pontos
          </Button>
          <Button onClick={() => unlockShield('first_weight')} variant="outline" className="w-full">
            Desbloquear Escudo "Primeira Pesagem"
          </Button>
          <Button onClick={() => collectSticker('motivated')} variant="outline" className="w-full">
            Coletar Figurinha "Motivado"
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationSystem;
