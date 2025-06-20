import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp, Trophy, Target, Share2, Calendar, Activity, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

const ProgressDashboard = () => {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar histórico de peso
      const { data: weightData, error: weightError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (weightError) throw weightError;
      setWeightHistory(weightData || []);

      // Carregar estatísticas do usuário
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      setUserStats(statsData);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  // Preparar dados para gráficos
  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: entry.weight,
    fullDate: entry.date
  }));

  // Dados para gráfico de progresso mensal
  const monthlyData = weightHistory.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, weights: [] };
    }
    acc[month].weights.push(entry.weight);
    return acc;
  }, {} as any);

  const monthlyChartData = Object.values(monthlyData).map((item: any) => ({
    month: item.month,
    avgWeight: (item.weights.reduce((sum: number, w: number) => sum + w, 0) / item.weights.length).toFixed(1),
    minWeight: Math.min(...item.weights),
    maxWeight: Math.max(...item.weights)
  }));

  // Calcular estatísticas
  const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const weightLoss = initialWeight - currentWeightValue;
  const avgWeightLossPerWeek = weightHistory.length > 7 ? (weightLoss / (weightHistory.length / 7)).toFixed(2) : '0';
  const bestWeekLoss = calculateBestWeekLoss();
  const consistencyScore = calculateConsistencyScore();

  function calculateBestWeekLoss() {
    if (weightHistory.length < 7) return 0;
    let maxLoss = 0;
    for (let i = 6; i < weightHistory.length; i++) {
      const weekLoss = weightHistory[i - 6].weight - weightHistory[i].weight;
      if (weekLoss > maxLoss) maxLoss = weekLoss;
    }
    return maxLoss.toFixed(1);
  }

  function calculateConsistencyScore() {
    if (weightHistory.length === 0) return 0;
    const totalDays = Math.floor((new Date().getTime() - new Date(weightHistory[0].date).getTime()) / (1000 * 60 * 60 * 24));
    return Math.round((weightHistory.length / Math.max(totalDays, 1)) * 100);
  }

  // Dados para gráfico de tendência semanal
  const weeklyData = [
    { day: 'Seg', weight: 73.2, taken: 2 },
    { day: 'Ter', weight: 73.0, taken: 2 },
    { day: 'Qua', weight: 72.8, taken: 2 },
    { day: 'Qui', weight: 72.9, taken: 1 },
    { day: 'Sex', weight: 72.6, taken: 2 },
    { day: 'Sáb', weight: 72.5, taken: 2 },
    { day: 'Dom', weight: 72.4, taken: 2 },
  ];

  const goalProgress = ((75.2 - 72.5) / (75.2 - 68.0)) * 100;

  // Dados para gráfico de consistência (últimos 30 dias)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const consistencyData = last30Days.map(date => ({
    date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    recorded: weightHistory.some(entry => entry.date === date) ? 1 : 0
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com título e compartilhar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">📊 Dashboard Completo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral do seu progresso e estatísticas</p>
        </div>
        {weightHistory.length > 0 && (
          <Button 
            variant="outline" 
            onClick={shareProgress}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        )}
      </div>

      {/* Card de Progresso da Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Meta</CardTitle>
          <CardDescription>
            Sua jornada rumo ao peso ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-900 dark:text-slate-100">Peso inicial: 75.2kg</span>
              <span className="text-slate-900 dark:text-slate-100">Meta: 68.0kg</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <div className="text-center text-sm text-slate-800 dark:text-slate-200">
              {goalProgress.toFixed(1)}% concluído
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">2.7kg</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Perdidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.5kg</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Restantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">37%</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Completo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Recompensas e Estatísticas */}
      {userStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Trophy className="w-5 h-5" />
                Nível {userStats.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800">{userStats.points} pontos</p>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 rounded-full h-2 transition-all"
                    style={{ width: `${(userStats.points % 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{100 - (userStats.points % 100)} pontos para próximo nível</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Award className="w-5 h-5" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-800">{userStats.shields?.length || 0} escudos</p>
                <p className="text-2xl font-bold text-blue-800">{userStats.stickers?.length || 0} figurinhas</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {userStats.streak} dias seguidos
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Activity className="w-5 h-5" />
                Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-800">{weightHistory.length} registros</p>
                <p className="text-sm text-green-600">Consistência: {consistencyScore}%</p>
                <Badge className="bg-green-100 text-green-800">
                  {avgWeightLossPerWeek}kg/semana
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico Principal de Evolução do Peso */}
      {weightHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Evolução do Peso
            </CardTitle>
            <CardDescription>
              Sua jornada de emagrecimento ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Peso']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#weightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aderência Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Aderência Semanal</CardTitle>
          <CardDescription>
            Peso diário e cápsulas tomadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'taken' ? `${value} cápsulas` : `${value} kg`,
                    name === 'taken' ? 'Cápsulas' : 'Peso'
                  ]}
                />
                <Bar dataKey="taken" fill="#dc2626" name="taken" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Secundários */}
      {weightHistory.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico de Progresso Mensal */}
          {monthlyChartData.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Progresso Mensal
                </CardTitle>
                <CardDescription>
                  Peso médio por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} kg`, 'Peso Médio']}
                      />
                      <Bar dataKey="avgWeight" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Consistência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Consistência (30 dias)
              </CardTitle>
              <CardDescription>
                Dias com registro de peso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consistencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip 
                      formatter={(value) => [value ? 'Registrado' : 'Não registrado', 'Status']}
                    />
                    <Bar 
                      dataKey="recorded" 
                      fill="#10b981" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cards de Estatísticas Detalhadas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">93%</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Aderência</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Dias seguidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">0.4kg</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Perda semanal</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">24.1</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">IMC atual</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas de Peso */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              Progresso Total
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
                  <span className={`font-semibold text-xl ${weightLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weightLoss >= 0 ? '-' : '+'}{Math.abs(weightLoss).toFixed(1)} kg
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center">
                Nenhum registro encontrado
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Velocidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Média/semana:</span>
              <span className="font-semibold">{avgWeightLossPerWeek} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Melhor semana:</span>
              <span className="font-semibold text-green-600">-{bestWeekLoss} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registros:</span>
              <span className="font-semibold text-blue-600">{weightHistory.length} dias</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Tempo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weightHistory.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dias ativos:</span>
                  <span className="font-semibold">{weightHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sequência:</span>
                  <span className="font-semibold text-orange-600">{userStats?.streak || 0} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consistência:</span>
                  <span className="font-semibold text-purple-600">{consistencyScore}%</span>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center text-sm">
                Comece registrando seu peso
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
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
                    Parabéns! Você já perdeu <span className="font-semibold text-red-600">{weightLoss.toFixed(1)}kg</span>!
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareProgress}
                    className="mt-2"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar
                  </Button>
                </>
              ) : weightHistory.length > 0 ? (
                <>
                  <div className="text-4xl">💪</div>
                  <p className="text-sm text-gray-600">
                    Continue firme! Todo esforço vale a pena.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-4xl">🎯</div>
                  <p className="text-sm text-gray-600">
                    Registre seu peso na tela inicial para ver suas estatísticas!
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

export default ProgressDashboard;
