
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play, Pause, RotateCcw, Trophy, Target, Timer, Calendar, TrendingUp, Zap, Bell, Settings, BookOpen, Heart, Brain, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: string;
  completed: boolean;
}

interface FastingGoal {
  weekly: number;
  monthly: number;
  currentWeek: number;
  currentMonth: number;
}

const IntermittentFasting = () => {
  const [currentFast, setCurrentFast] = useState<FastingSession | null>(null);
  const [fastingHistory, setFastingHistory] = useState<FastingSession[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("16:8");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState({
    start: true,
    halfway: true,
    end: true
  });
  const [fastingGoals, setFastingGoals] = useState<FastingGoal>({
    weekly: 5,
    monthly: 20,
    currentWeek: 3,
    currentMonth: 12
  });
  const { toast } = useToast();

  // Planos de jejum expandidos com mais opções
  const fastingPlans = {
    "12:12": {
      name: "12:12 - Iniciante",
      fast: 12,
      eat: 12,
      description: "12h jejum, 12h janela alimentar",
      difficulty: "Muito Fácil",
      benefits: ["Introdução ao jejum", "Melhora digestão", "Ritmo circadiano"],
      color: "bg-blue-500",
      calories: "Queima ~200 calorias extra"
    },
    "14:10": {
      name: "14:10 - Adaptação",
      fast: 14,
      eat: 10,
      description: "14h jejum, 10h janela alimentar",
      difficulty: "Fácil",
      benefits: ["Transição suave", "Controle apetite", "Energia estável"],
      color: "bg-cyan-500",
      calories: "Queima ~300 calorias extra"
    },
    "16:8": {
      name: "16:8 - Método Clássico",
      fast: 16,
      eat: 8,
      description: "16h jejum, 8h janela alimentar",
      difficulty: "Iniciante",
      benefits: ["Melhora metabolismo", "Perda de peso gradual", "Fácil de manter"],
      color: "bg-green-500",
      calories: "Queima ~400 calorias extra"
    },
    "18:6": {
      name: "18:6 - Intermediário",
      fast: 18,
      eat: 6,
      description: "18h jejum, 6h janela alimentar",
      difficulty: "Intermediário",
      benefits: ["Autofagia aumentada", "Maior queima de gordura", "Disciplina mental"],
      color: "bg-yellow-500",
      calories: "Queima ~500 calorias extra"
    },
    "20:4": {
      name: "20:4 - Warrior Diet",
      fast: 20,
      eat: 4,
      description: "20h jejum, 4h janela alimentar",
      difficulty: "Avançado",
      benefits: ["Autofagia intensa", "Máxima eficiência", "Concentração elevada"],
      color: "bg-orange-500",
      calories: "Queima ~600 calorias extra"
    },
    "24:0": {
      name: "24:0 - OMAD",
      fast: 24,
      eat: 0,
      description: "Uma refeição por dia",
      difficulty: "Expert",
      benefits: ["Máxima simplicidade", "Economia de tempo", "Regeneração celular"],
      color: "bg-red-500",
      calories: "Queima ~700+ calorias extra"
    },
    "36:12": {
      name: "36:12 - Jejum Prolongado",
      fast: 36,
      eat: 12,
      description: "36h jejum, 12h janela (dias alternados)",
      difficulty: "Expert+",
      benefits: ["Autofagia máxima", "Reset metabólico", "Longevidade"],
      color: "bg-purple-500",
      calories: "Queima ~1000+ calorias extra"
    }
  };

  // Timer effect com notificações
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          const newTime = time - 1;
          
          // Notificações em marcos importantes
          if (notifications && currentFast) {
            const elapsed = currentFast.duration - newTime;
            const progress = (elapsed / currentFast.duration) * 100;
            
            // Notificação aos 50%
            if (reminders.halfway && Math.floor(progress) === 50 && Math.floor(((currentFast.duration - time) / currentFast.duration) * 100) === 49) {
              toast({
                title: "🔥 Meio Caminho!",
                description: "Você já completou 50% do seu jejum! Continue firme!",
                duration: 5000
              });
            }
            
            // Notificação aos 90%
            if (Math.floor(progress) === 90 && Math.floor(((currentFast.duration - time) / currentFast.duration) * 100) === 89) {
              toast({
                title: "🏁 Quase Lá!",
                description: "Faltam apenas 10% para completar seu jejum!",
                duration: 5000
              });
            }
          }
          
          if (newTime <= 1) {
            setIsActive(false);
            completeFast();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, notifications, reminders, currentFast]);

  const startFast = () => {
    const plan = fastingPlans[selectedPlan as keyof typeof fastingPlans];
    const duration = plan.fast * 60 * 60; // Convert hours to seconds
    const newFast: FastingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration,
      type: selectedPlan,
      completed: false
    };
    
    setCurrentFast(newFast);
    setTimeRemaining(duration);
    setIsActive(true);
    
    if (notifications && reminders.start) {
      toast({
        title: "🚀 Jejum Iniciado!",
        description: `Jejum ${selectedPlan} começou. Você consegue! ${plan.calories}`,
        duration: 5000
      });
    }
  };

  const pauseFast = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "⏸️ Jejum Pausado" : "▶️ Jejum Retomado",
      description: isActive ? "Jejum pausado temporariamente" : "Jejum retomado com sucesso",
    });
  };

  const stopFast = () => {
    if (currentFast) {
      const completedFast = {
        ...currentFast,
        endTime: new Date(),
        completed: false
      };
      setFastingHistory(prev => [...prev, completedFast]);
    }
    
    setCurrentFast(null);
    setTimeRemaining(0);
    setIsActive(false);
    
    toast({
      title: "🛑 Jejum Interrompido",
      description: "Não se preocupe, toda tentativa é um aprendizado!",
    });
  };

  const completeFast = () => {
    if (currentFast) {
      const completedFast = {
        ...currentFast,
        endTime: new Date(),
        completed: true
      };
      setFastingHistory(prev => [...prev, completedFast]);
      
      // Atualizar metas
      setFastingGoals(prev => ({
        ...prev,
        currentWeek: prev.currentWeek + 1,
        currentMonth: prev.currentMonth + 1
      }));
      
      if (notifications && reminders.end) {
        toast({
          title: "🎉 Parabéns! Jejum Concluído!",
          description: `Você completou seu jejum ${selectedPlan}! +50 pontos conquistados!`,
          duration: 8000
        });
      }
    }
    
    setCurrentFast(null);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!currentFast || timeRemaining === 0) return 0;
    const elapsed = currentFast.duration - timeRemaining;
    return (elapsed / currentFast.duration) * 100;
  };

  const getStreakCount = () => {
    let streak = 0;
    const sortedHistory = [...fastingHistory].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    for (const fast of sortedHistory) {
      if (fast.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const completedFasts = fastingHistory.filter(fast => fast.completed).length;
  const totalFasts = fastingHistory.length;
  const successRate = totalFasts > 0 ? (completedFasts / totalFasts) * 100 : 0;
  const totalHoursFasted = fastingHistory
    .filter(fast => fast.completed)
    .reduce((total, fast) => total + (fast.duration / 3600), 0);

  const getMotivationalMessage = () => {
    const progress = calculateProgress();
    if (progress < 25) return "🌱 Começando forte! Cada minuto conta!";
    if (progress < 50) return "🔥 Você está indo muito bem! Continue assim!";
    if (progress < 75) return "💪 Mais da metade concluída! Você é incrível!";
    if (progress < 90) return "🏃‍♂️ Reta final! Você quase conseguiu!";
    return "🏆 Últimos minutos! Você é um campeão!";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">⏰ Jejum Intermitente</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transforme sua saúde com o poder do jejum intermitente científico
        </p>
      </div>

      {/* Timer Principal */}
      <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Timer className="w-8 h-8" />
            {currentFast ? `Jejum ${currentFast.type}` : 'Pronto para Jejuar?'}
          </CardTitle>
          {currentFast && (
            <CardDescription className="text-lg">
              {isActive ? getMotivationalMessage() : 'Jejum pausado - Continue quando estiver pronto'}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {currentFast ? (
            <>
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {formatTime(timeRemaining)}
                </div>
                <Progress value={calculateProgress()} className="h-4 mb-4" />
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{calculateProgress().toFixed(1)}% concluído</span>
                  <span>{formatTime(currentFast.duration - timeRemaining)} / {formatTime(currentFast.duration)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {fastingPlans[currentFast.type as keyof typeof fastingPlans]?.calories}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={pauseFast}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isActive ? 'Pausar' : 'Continuar'}
                </Button>
                <Button
                  onClick={stopFast}
                  variant="destructive"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Parar Jejum
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Plan Selection */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(fastingPlans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedPlan === key 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <Badge className={plan.color}>{plan.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{plan.description}</p>
                      <p className="text-xs text-orange-600 font-medium mb-3">{plan.calories}</p>
                      <div className="space-y-1">
                        {plan.benefits.slice(0, 2).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={startFast}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Jejum {selectedPlan}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Metas e Progresso Semanal/Mensal */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Metas Semanais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progresso da Semana</span>
                <span>{fastingGoals.currentWeek}/{fastingGoals.weekly}</span>
              </div>
              <Progress value={(fastingGoals.currentWeek / fastingGoals.weekly) * 100} className="h-2" />
              <p className="text-xs text-gray-600">
                {fastingGoals.weekly - fastingGoals.currentWeek > 0 
                  ? `Faltam ${fastingGoals.weekly - fastingGoals.currentWeek} jejuns para bater a meta!`
                  : "🎉 Meta semanal batida!"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Metas Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progresso do Mês</span>
                <span>{fastingGoals.currentMonth}/{fastingGoals.monthly}</span>
              </div>
              <Progress value={(fastingGoals.currentMonth / fastingGoals.monthly) * 100} className="h-2" />
              <p className="text-xs text-gray-600">
                {fastingGoals.monthly - fastingGoals.currentMonth > 0 
                  ? `Faltam ${fastingGoals.monthly - fastingGoals.currentMonth} jejuns para a meta mensal!`
                  : "🏆 Meta mensal conquistada!"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards Expandidas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{getStreakCount()}</p>
            <p className="text-sm text-gray-600">Sequência</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{completedFasts}</p>
            <p className="text-sm text-gray-600">Jejuns Completos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{successRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Taxa de Sucesso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{totalHoursFasted.toFixed(0)}h</p>
            <p className="text-sm text-gray-600">Total Jejuado</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{totalFasts}</p>
            <p className="text-sm text-gray-600">Total Tentativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Information Tabs Expandidas */}
      <Tabs defaultValue="benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
          <TabsTrigger value="science">Ciência</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🧬 Benefícios Científicos do Jejum Intermitente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <Flame className="w-4 h-4" /> Perda de Peso
                  </h4>
                  <p className="text-sm">Acelera o metabolismo e promove a queima de gordura corporal de forma eficiente</p>
                  <Badge variant="secondary" className="text-xs">Queima 300-700+ calorias extras</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Saúde Cerebral
                  </h4>
                  <p className="text-sm">Melhora a função cognitiva, memória e pode proteger contra Alzheimer</p>
                  <Badge variant="secondary" className="text-xs">+40% BDNF (fator de crescimento neural)</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600">🔄 Autofagia</h4>
                  <p className="text-sm">Processo de limpeza celular que remove componentes danificados e toxinas</p>
                  <Badge variant="secondary" className="text-xs">Ativa após 16-18h de jejum</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Saúde Cardiovascular
                  </h4>
                  <p className="text-sm">Reduz pressão arterial, colesterol e inflamação</p>
                  <Badge variant="secondary" className="text-xs">-10-15% fatores de risco</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600">📈 Sensibilidade à Insulina</h4>
                  <p className="text-sm">Melhora controle glicêmico e previne diabetes tipo 2</p>
                  <Badge variant="secondary" className="text-xs">+20-30% sensibilidade</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-600 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Energia e Longevidade
                  </h4>
                  <p className="text-sm">Energia mais estável, hormônios otimizados e aumento da longevidade</p>
                  <Badge variant="secondary" className="text-xs">+15-20% expectativa de vida (estudos)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>💡 Dicas Avançadas para Jejum de Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Hidratação Estratégica</h4>
                    <p className="text-sm text-gray-600 mb-2">Beba 2-3L de água, chás sem açúcar e café preto. Adicione eletrólitos se necessário.</p>
                    <Badge variant="outline" className="text-xs">🧂 Pitada de sal rosa no primeiro copo</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Progressão Inteligente</h4>
                    <p className="text-sm text-gray-600 mb-2">12:12 → 14:10 → 16:8 → 18:6. Aumente 2h por semana.</p>
                    <Badge variant="outline" className="text-xs">📈 Adaptação gradual = sucesso sustentável</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Atividades Produtivas</h4>
                    <p className="text-sm text-gray-600 mb-2">Trabalho, exercícios leves, leitura, meditação durante o jejum.</p>
                    <Badge variant="outline" className="text-xs">🧘‍♀️ Mindfulness potencializa os benefícios</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Quebra de Jejum Perfeita</h4>
                    <p className="text-sm text-gray-600 mb-2">Comece com vegetais, proteínas magras, gorduras boas. Evite açúcar e carboidratos refinados.</p>
                    <Badge variant="outline" className="text-xs">🥗 1ª refeição determina como você se sentirá</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">Sinais do Corpo</h4>
                    <p className="text-sm text-gray-600 mb-2">Tontura, fraqueza extrema, náusea = pare imediatamente. Jejum deve ser confortável.</p>
                    <Badge variant="destructive" className="text-xs">⚠️ Sua segurança é prioridade</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold">Timing Ideal</h4>
                    <p className="text-sm text-gray-600 mb-2">Termine a última refeição às 20h, quebre o jejum às 12h (16:8). Alinhado com ritmo circadiano.</p>
                    <Badge variant="outline" className="text-xs">🌙 Jejum durante o sono = mais fácil</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="science" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                🔬 A Ciência por Trás do Jejum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-600">Fases do Jejum</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><strong>0-4h:</strong> Digestão e absorção</p>
                    <p><strong>4-12h:</strong> Estado pós-absortivo, uso de glicogênio</p>
                    <p><strong>12-18h:</strong> Cetose inicial, queima de gordura</p>
                    <p><strong>18-24h:</strong> Autofagia ativa, regeneração celular</p>
                    <p><strong>24h+:</strong> Cetose profunda, máximos benefícios</p>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-600">Hormônios Otimizados</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>• <strong>Hormônio do Crescimento:</strong> +1300-2000%</p>
                    <p>• <strong>Noradrenalina:</strong> +117% (queima gordura)</p>
                    <p>• <strong>Insulina:</strong> -20-31% (sensibilidade melhora)</p>
                    <p>• <strong>IGF-1:</strong> Redução controlada (longevidade)</p>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-600">Estudos Recentes</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>• <strong>Harvard 2023:</strong> JI reduz inflamação em 40%</p>
                    <p>• <strong>Cell 2022:</strong> Autofagia previne câncer</p>
                    <p>• <strong>Nature 2023:</strong> Jejum aumenta longevidade</p>
                    <p>• <strong>NEJM 2019:</strong> Benefícios cardiovasculares comprovados</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Jejum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notificações */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Notificações</h4>
                    <p className="text-sm text-gray-600">Receber alertas sobre o jejum</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                {notifications && (
                  <div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Início do jejum</label>
                      <Switch
                        checked={reminders.start}
                        onCheckedChange={(checked) => setReminders(prev => ({ ...prev, start: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Meio do jejum (50%)</label>
                      <Switch
                        checked={reminders.halfway}
                        onCheckedChange={(checked) => setReminders(prev => ({ ...prev, halfway: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Final do jejum</label>
                      <Switch
                        checked={reminders.end}
                        onCheckedChange={(checked) => setReminders(prev => ({ ...prev, end: checked }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Metas */}
              <div className="space-y-4">
                <h4 className="font-semibold">Metas Personalizadas</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Jejuns por semana</label>
                    <Select
                      value={fastingGoals.weekly.toString()}
                      onValueChange={(value) => setFastingGoals(prev => ({ ...prev, weekly: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 jejuns</SelectItem>
                        <SelectItem value="4">4 jejuns</SelectItem>
                        <SelectItem value="5">5 jejuns</SelectItem>
                        <SelectItem value="6">6 jejuns</SelectItem>
                        <SelectItem value="7">7 jejuns (diário)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jejuns por mês</label>
                    <Select
                      value={fastingGoals.monthly.toString()}
                      onValueChange={(value) => setFastingGoals(prev => ({ ...prev, monthly: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 jejuns</SelectItem>
                        <SelectItem value="20">20 jejuns</SelectItem>
                        <SelectItem value="25">25 jejuns</SelectItem>
                        <SelectItem value="30">30 jejuns (diário)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📊 Histórico Detalhado</span>
                <Badge variant="secondary">{totalFasts} registros</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fastingHistory.length > 0 ? (
                <div className="space-y-3">
                  {fastingHistory.slice(0, 20).map((fast) => (
                    <div key={fast.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${fast.completed ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{fast.type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(fast.startTime).toLocaleDateString('pt-BR')} às {new Date(fast.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {fast.completed && fast.endTime && (
                            <p className="text-xs text-gray-500">
                              Duração: {Math.round((new Date(fast.endTime).getTime() - new Date(fast.startTime).getTime()) / (1000 * 60 * 60))}h
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={fast.completed ? "default" : "secondary"}>
                          {fast.completed ? "✅ Completo" : "❌ Interrompido"}
                        </Badge>
                        {fast.completed && (
                          <p className="text-xs text-green-600 mt-1">
                            +{fastingPlans[fast.type as keyof typeof fastingPlans]?.calories?.replace('Queima ', '').replace(' extra', '') || '50 pontos'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {fastingHistory.length > 20 && (
                    <p className="text-center text-sm text-gray-500 pt-4 border-t">
                      E mais {fastingHistory.length - 20} registros...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Nenhum jejum registrado ainda</p>
                  <p className="text-sm text-gray-500">Comece seu primeiro jejum para ver o histórico aqui!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntermittentFasting;
