
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, Plus, Trophy, Target, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

const WeightTracker = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWeightHistory();
  }, []);

  const loadWeightHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      setWeightHistory(data || []);
    } catch (error) {
      console.error('Error loading weight history:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de peso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const awardPoints = async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar estatísticas atuais
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const currentPoints = stats?.points || 0;
      const newPoints = currentPoints + points;
      const newLevel = Math.floor(newPoints / 100) + 1;

      // Atualizar pontos
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: stats?.shields || [],
          stickers: stats?.stickers || [],
          streak: stats?.streak || 0
        });

      toast({
        title: `🎉 +${points} pontos!`,
        description: reason,
        duration: 3000
      });

      // Verificar se desbloqueou medalhas
      await checkForNewAchievements(user.id, stats);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const checkForNewAchievements = async (userId: string, currentStats: any) => {
    try {
      const shields = currentStats?.shields || [];
      const stickers = currentStats?.stickers || [];
      let newShields = [...shields];
      let newStickers = [...stickers];

      // Primeira pesagem
      if (!shields.includes('first_weight')) {
        newShields.push('first_weight');
        toast({
          title: "🛡️ Novo Escudo Desbloqueado!",
          description: "⚖️ Primeira Pesagem - Você registrou seu primeiro peso!",
          duration: 5000
        });
      }

      // Figurinha motivado para qualquer registro
      if (!stickers.includes('motivated')) {
        newStickers.push('motivated');
        toast({
          title: "⭐ Nova Figurinha Coletada!",
          description: "💪 Motivado - Continue assim!",
          duration: 5000
        });
      }

      // Conquistador se perdeu peso
      if (weightHistory.length >= 2) {
        const initialWeight = weightHistory[0].weight;
        const currentWeightValue = weightHistory[weightHistory.length - 1].weight;
        if (currentWeightValue < initialWeight && !shields.includes('goal_achiever')) {
          newShields.push('goal_achiever');
          toast({
            title: "🛡️ Novo Escudo Desbloqueado!",
            description: "🎯 Conquistador - Você está perdendo peso!",
            duration: 5000
          });
        }
      }

      // Atualizar badges se houver novos
      if (newShields.length > shields.length || newStickers.length > stickers.length) {
        await supabase
          .from('user_stats')
          .update({
            shields: newShields,
            stickers: newStickers
          })
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const handleAddWeight = async () => {
    if (!currentWeight) return;

    setIsRegistering(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('weight_entries')
        .insert({
          user_id: user.id,
          weight: parseFloat(currentWeight),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      await loadWeightHistory();
      setCurrentWeight("");
      
      // Dar pontos pelo registro
      await awardPoints(10, "Peso registrado com sucesso!");
      
      toast({
        title: "✅ Peso registrado!",
        description: `Peso de ${currentWeight}kg foi adicionado ao seu histórico`,
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error adding weight:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "weight_entries_user_id_date_key"' 
          ? "Você já registrou seu peso hoje"
          : "Não foi possível adicionar o peso",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const shareProgress = async () => {
    const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const weightLoss = initialWeight - currentWeightValue;

    try {
      const shareData = {
        title: 'SB2FIT - Meu Progresso',
        text: `Estou usando o SB2FIT! ${weightLoss > 0 ? `Já perdi ${weightLoss.toFixed(1)}kg` : `Peso atual: ${currentWeightValue}kg`} 💪`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "Cole onde quiser compartilhar seu progresso"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: entry.weight
  }));

  const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const weightLoss = initialWeight - currentWeightValue;
  const todayRegistered = weightHistory.some(entry => entry.date === new Date().toISOString().split('T')[0]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Principal de Registro - Destaque */}
      <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl text-red-600 dark:text-red-400">
            <Scale className="w-8 h-8" />
            Registrar Peso Hoje
          </CardTitle>
          <CardDescription className="text-lg">
            {todayRegistered ? (
              <span className="text-green-600 font-semibold">✅ Peso já registrado hoje! (+10 pontos)</span>
            ) : (
              <span className="text-red-600 font-semibold">📅 Registre seu peso e ganhe 10 pontos!</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="weight" className="text-lg font-semibold">Peso atual (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="text-lg h-12 border-2 border-red-200 focus:border-red-500"
                disabled={todayRegistered}
              />
            </div>
            <Button 
              onClick={handleAddWeight} 
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 h-12 text-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!currentWeight || todayRegistered || isRegistering}
            >
              {isRegistering ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {todayRegistered ? "Já Registrado" : "Registrar Peso"}
            </Button>
          </div>
          
          {!todayRegistered && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Recompensas por registrar:</span>
              </div>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• +10 pontos por registro diário</li>
                <li>• Chance de desbloquear medalhas</li>
                <li>• Progresso para próximo nível</li>
                <li>• Manter sequência de dias</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Evolução */}
      {weightHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Gráfico de Evolução
                </CardTitle>
                <CardDescription>
                  Sua jornada de emagrecimento com SB2 Turbo
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={shareProgress}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Peso']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas e Motivação */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weightHistory.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso inicial:</span>
                  <span className="font-semibold">{initialWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso atual:</span>
                  <span className="font-semibold">{currentWeightValue} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{weightLoss >= 0 ? 'Perdidos:' : 'Ganhos:'}</span>
                  <span className={`font-semibold ${weightLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weightLoss >= 0 ? '-' : '+'}{Math.abs(weightLoss).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registros:</span>
                  <span className="font-semibold text-blue-600">{weightHistory.length} dias</span>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center">
                Registre seu primeiro peso para ver as estatísticas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💪 Motivação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              {weightHistory.length > 0 && weightLoss > 0 ? (
                <>
                  <div className="text-4xl">🎉</div>
                  <p className="text-sm text-gray-600">
                    Parabéns! Você já perdeu <span className="font-semibold text-red-600">{weightLoss.toFixed(1)}kg</span> com o SB2 Turbo!
                  </p>
                  <p className="text-xs text-gray-500">
                    Continue registrando diariamente para manter o progresso!
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareProgress}
                    className="mt-2"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar Conquista
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-4xl">🎯</div>
                  <p className="text-sm text-gray-600">
                    {todayRegistered ? (
                      "Ótimo! Peso registrado hoje. Volte amanhã!"
                    ) : (
                      "Registre seu peso hoje e ganhe pontos!"
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cada registro conta para seus objetivos e medalhas.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightTracker;
