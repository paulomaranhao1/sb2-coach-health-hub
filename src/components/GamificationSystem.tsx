
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Star, Gift, Share2 } from 'lucide-react';

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
  const { toast } = useToast();

  const shields = [
    { id: 'first_weight', name: 'Primeira Pesagem', emoji: '⚖️', description: 'Registrou seu primeiro peso' },
    { id: 'week_streak', name: 'Semana Consistente', emoji: '🔥', description: '7 dias seguidos de uso' },
    { id: 'goal_achiever', name: 'Conquistador', emoji: '🎯', description: 'Atingiu uma meta de peso' },
    { id: 'supplement_master', name: 'Mestre dos Suplementos', emoji: '💊', description: '30 dias tomando suplemento' }
  ];

  const stickers = [
    { id: 'motivated', name: 'Motivado', emoji: '💪', rarity: 'comum' },
    { id: 'focused', name: 'Focado', emoji: '🎯', rarity: 'comum' },
    { id: 'champion', name: 'Campeão', emoji: '🏆', rarity: 'raro' },
    { id: 'legend', name: 'Lenda', emoji: '👑', rarity: 'épico' }
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
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error:', error);
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            🛡️ Escudos de Conquista
          </CardTitle>
          <CardDescription>
            Desbloqueie escudos completando desafios
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
            Coleção de Figurinhas
          </CardTitle>
          <CardDescription>
            Colecione e compartilhe suas conquistas
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
                  {isCollected && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => shareSticker(sticker.id)}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartilhar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Teste */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 Ações de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={() => addPoints(10, "Peso registrado!")} className="w-full">
            <Gift className="w-4 h-4 mr-2" />
            Ganhar 10 pontos
          </Button>
          <Button onClick={() => unlockShield('first_weight')} variant="outline" className="w-full">
            Desbloquear Escudo "Primeira Pesagem"
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationSystem;
