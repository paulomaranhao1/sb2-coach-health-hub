import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Flame, Camera, Scale, Timer, Target, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AchievementNotification from '../AchievementNotification';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'weight' | 'fasting' | 'calories' | 'general';
  points: number;
  requirement: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  points: number;
  level: number;
  achievements: string[];
  totalWeightEntries: number;
  totalFastingSessions: number;
  totalCaloriePhotos: number;
  streak: number;
}

const AchievementSystem = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    achievements: [],
    totalWeightEntries: 0,
    totalFastingSessions: 0,
    totalCaloriePhotos: 0,
    streak: 0
  });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const achievements: Achievement[] = [
    // Conquistas de Peso
    { id: 'first_weight', name: 'Primeira Pesagem', description: 'Registrou seu primeiro peso', emoji: '⚖️', category: 'weight', points: 50, requirement: 'Registrar peso pela primeira vez', isUnlocked: false },
    { id: 'weight_streak_7', name: 'Semana Consistente', description: '7 dias seguidos registrando peso', emoji: '📈', category: 'weight', points: 100, requirement: '7 dias de streak', isUnlocked: false },
    { id: 'weight_streak_30', name: 'Mestre da Consistência', description: '30 dias seguidos registrando peso', emoji: '🏆', category: 'weight', points: 300, requirement: '30 dias de streak', isUnlocked: false },
    { id: 'weight_streak_90', name: 'Lenda da Disciplina', description: '90 dias seguidos registrando peso', emoji: '👑', category: 'weight', points: 1000, requirement: '90 dias de streak', isUnlocked: false },
    { id: 'weight_loss_1kg', name: 'Primeiro Quilo', description: 'Perdeu 1kg do peso inicial', emoji: '🎯', category: 'weight', points: 150, requirement: 'Perder 1kg', isUnlocked: false },
    { id: 'weight_loss_5kg', name: 'Guerreiro', description: 'Perdeu 5kg do peso inicial', emoji: '⚔️', category: 'weight', points: 500, requirement: 'Perder 5kg', isUnlocked: false },
    { id: 'weight_loss_10kg', name: 'Transformação', description: 'Perdeu 10kg do peso inicial', emoji: '🦋', category: 'weight', points: 1000, requirement: 'Perder 10kg', isUnlocked: false },
    
    // Conquistas de Jejum
    { id: 'first_fast', name: 'Primeiro Jejum', description: 'Completou seu primeiro jejum', emoji: '⏰', category: 'fasting', points: 75, requirement: 'Completar primeiro jejum', isUnlocked: false },
    { id: 'fast_12h', name: 'Disciplinado', description: 'Completou jejum de 12 horas', emoji: '🕐', category: 'fasting', points: 100, requirement: 'Jejum de 12h', isUnlocked: false },
    { id: 'fast_16h', name: 'Determinado', description: 'Completou jejum de 16 horas', emoji: '🔥', category: 'fasting', points: 150, requirement: 'Jejum de 16h', isUnlocked: false },
    { id: 'fast_24h', name: 'Guerreiro do Jejum', description: 'Completou jejum de 24 horas', emoji: '⚡', category: 'fasting', points: 300, requirement: 'Jejum de 24h', isUnlocked: false },
    { id: 'fast_48h', name: 'Mestre do Controle', description: 'Completou jejum de 48 horas', emoji: '🏔️', category: 'fasting', points: 750, requirement: 'Jejum de 48h', isUnlocked: false },
    { id: 'fast_week', name: 'Semana de Jejum', description: '7 jejuns completados', emoji: '🌟', category: 'fasting', points: 250, requirement: '7 jejuns completos', isUnlocked: false },
    { id: 'fast_month', name: 'Mês de Disciplina', description: '30 jejuns completados', emoji: '💎', category: 'fasting', points: 1000, requirement: '30 jejuns completos', isUnlocked: false },
    
    // Conquistas de Calorias
    { id: 'first_photo', name: 'Primeira Análise', description: 'Analisou primeira foto de comida', emoji: '📸', category: 'calories', points: 50, requirement: 'Primeira foto analisada', isUnlocked: false },
    { id: 'photo_streak_7', name: 'Fotógrafo Consistente', description: '7 fotos analisadas em 7 dias', emoji: '📷', category: 'calories', points: 100, requirement: '7 fotos em 7 dias', isUnlocked: false },
    { id: 'photo_streak_30', name: 'Analista Profissional', description: '30 fotos analisadas em 30 dias', emoji: '🔍', category: 'calories', points: 300, requirement: '30 fotos em 30 dias', isUnlocked: false },
    { id: 'calories_tracked_1000', name: 'Contador de Calorias', description: 'Monitorou 1000 calorias', emoji: '🍎', category: 'calories', points: 75, requirement: '1000 calorias monitoradas', isUnlocked: false },
    { id: 'calories_tracked_5000', name: 'Especialista Nutricional', description: 'Monitorou 5000 calorias', emoji: '🥗', category: 'calories', points: 200, requirement: '5000 calorias monitoradas', isUnlocked: false },
    { id: 'calories_tracked_10000', name: 'Nutricionista Expert', description: 'Monitorou 10000 calorias', emoji: '👨‍⚕️', category: 'calories', points: 500, requirement: '10000 calorias monitoradas', isUnlocked: false },
    
    // Conquistas Gerais
    { id: 'points_500', name: 'Colecionador', description: 'Acumulou 500 pontos', emoji: '💎', category: 'general', points: 0, requirement: '500 pontos', isUnlocked: false },
    { id: 'points_1000', name: 'Milionário de Pontos', description: 'Acumulou 1000 pontos', emoji: '💰', category: 'general', points: 0, requirement: '1000 pontos', isUnlocked: false },
    { id: 'points_2500', name: 'Magnata', description: 'Acumulou 2500 pontos', emoji: '🏦', category: 'general', points: 0, requirement: '2500 pontos', isUnlocked: false },
    { id: 'level_5', name: 'Evoluído', description: 'Alcançou nível 5', emoji: '🚀', category: 'general', points: 0, requirement: 'Nível 5', isUnlocked: false },
    { id: 'level_10', name: 'Veterano', description: 'Alcançou nível 10', emoji: '🎖️', category: 'general', points: 0, requirement: 'Nível 10', isUnlocked: false },
    { id: 'level_25', name: 'Lenda', description: 'Alcançou nível 25', emoji: '🏆', category: 'general', points: 0, requirement: 'Nível 25', isUnlocked: false },
    { id: 'completionist', name: 'Completista', description: 'Desbloqueou 10 conquistas', emoji: '🌈', category: 'general', points: 300, requirement: '10 conquistas', isUnlocked: false },
    { id: 'perfectionist', name: 'Perfeccionista', description: 'Desbloqueou 20 conquistas', emoji: '✨', category: 'general', points: 750, requirement: '20 conquistas', isUnlocked: false }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
        setUserStats({
          points: stats.points || 0,
          level: stats.level || 1,
          achievements: stats.shields || [],
          totalWeightEntries: weightEntries?.length || 0,
          totalFastingSessions: fastingSessions?.filter(f => f.completed)?.length || 0,
          totalCaloriePhotos: calorieAnalyses?.length || 0,
          streak: stats.streak || 0
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = async () => {
    const newlyUnlocked: Achievement[] = [];
    
    achievements.forEach(achievement => {
      if (userStats.achievements.includes(achievement.id)) return;
      
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_weight':
          shouldUnlock = userStats.totalWeightEntries >= 1;
          break;
        case 'weight_streak_7':
          shouldUnlock = userStats.streak >= 7;
          break;
        case 'weight_streak_30':
          shouldUnlock = userStats.streak >= 30;
          break;
        case 'weight_streak_90':
          shouldUnlock = userStats.streak >= 90;
          break;
        case 'weight_loss_1kg':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'weight_loss_5kg':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'weight_loss_10kg':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'first_fast':
          shouldUnlock = userStats.totalFastingSessions >= 1;
          break;
        case 'fast_12h':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'fast_16h':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'fast_24h':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
       case 'fast_48h':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'fast_week':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'fast_month':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'first_photo':
          shouldUnlock = userStats.totalCaloriePhotos >= 1;
          break;
        case 'photo_streak_7':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'photo_streak_30':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'calories_tracked_1000':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'calories_tracked_5000':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'calories_tracked_10000':
          shouldUnlock = true; // Implementar lógica de verificação
          break;
        case 'points_500':
          shouldUnlock = userStats.points >= 500;
          break;
        case 'points_1000':
          shouldUnlock = userStats.points >= 1000;
          break;
        case 'points_2500':
          shouldUnlock = userStats.points >= 2500;
          break;
        case 'level_5':
          shouldUnlock = userStats.level >= 5;
          break;
        case 'level_10':
          shouldUnlock = userStats.level >= 10;
          break;
        case 'level_25':
          shouldUnlock = userStats.level >= 25;
          break;
        case 'completionist':
          shouldUnlock = userStats.achievements.length >= 10;
          break;
        case 'perfectionist':
          shouldUnlock = userStats.achievements.length >= 20;
          break;
      }
      
      if (shouldUnlock) {
        newlyUnlocked.push({ ...achievement, isUnlocked: true });
      }
    });

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      await saveNewAchievements(newlyUnlocked);
    }
  };

  const saveNewAchievements = async (newAchievements: Achievement[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      if (!error) {
        setUserStats(prev => ({
          ...prev,
          achievements: [...prev.achievements, ...newAchievementIds],
          points: prev.points + totalPoints
        }));
      }
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.category === category).map(achievement => ({
      ...achievement,
      isUnlocked: userStats.achievements.includes(achievement.id)
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weight': return <Scale className="w-4 h-4" />;
      case 'fasting': return <Timer className="w-4 h-4" />;
      case 'calories': return <Camera className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getLevelProgress = () => {
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

  const totalAchievements = achievements.length;
  const unlockedAchievements = userStats.achievements.length;
  const completionPercentage = (unlockedAchievements / totalAchievements) * 100;
  const levelProgress = getLevelProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {newAchievements.length > 0 && (
        <AchievementNotification
          achievements={newAchievements.map(a => ({
            id: a.id,
            type: 'shield',
            name: a.name,
            emoji: a.emoji,
            description: a.description
          }))}
          onClose={() => setNewAchievements([])}
        />
      )}

      {/* Header com estatísticas expandido */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Sistema de Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Crown className="w-6 h-6" />
                {userStats.level}
              </div>
              <div className="text-sm opacity-90">Nível</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Zap className="w-6 h-6" />
                {userStats.points}
              </div>
              <div className="text-sm opacity-90">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{unlockedAchievements}/{totalAchievements}</div>
              <div className="text-sm opacity-90">Conquistas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
              <div className="text-sm opacity-90">Completo</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso do Nível {userStats.level}</span>
                <span>{levelProgress.current}/{levelProgress.total} pontos</span>
              </div>
              <Progress value={levelProgress.percentage} className="bg-red-400/30" />
              <div className="text-xs opacity-75 mt-1 text-center">
                {100 - levelProgress.current} pontos para o próximo nível
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Geral</span>
                <span>{unlockedAchievements}/{totalAchievements}</span>
              </div>
              <Progress value={completionPercentage} className="bg-red-400/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas por categoria */}
      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Peso
          </TabsTrigger>
          <TabsTrigger value="fasting" className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Jejum
          </TabsTrigger>
          <TabsTrigger value="calories" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Calorias
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Geral
          </TabsTrigger>
        </TabsList>

        {(['weight', 'fasting', 'calories', 'general'] as const).map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAchievementsByCategory(category).map(achievement => (
                <Card 
                  key={achievement.id}
                  className={`${achievement.isUnlocked 
                    ? 'border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'border-gray-200 bg-gray-50 opacity-70'
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{achievement.emoji}</div>
                      <div>
                        <h3 className="font-bold text-lg">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{achievement.requirement}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {achievement.isUnlocked ? (
                          <Badge className="bg-green-600 text-white">
                            <Trophy className="w-3 h-3 mr-1" />
                            Desbloqueada
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Bloqueada</Badge>
                        )}
                        {achievement.points > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                            +{achievement.points} pts
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Button 
        onClick={checkAndUnlockAchievements} 
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        <Flame className="w-4 h-4 mr-2" />
        Verificar Novas Conquistas
      </Button>
    </div>
  );
};

export default AchievementSystem;
