
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play, Pause, RotateCcw, Trophy, Target, Timer, Calendar, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: string;
  completed: boolean;
}

const IntermittentFasting = () => {
  const [currentFast, setCurrentFast] = useState<FastingSession | null>(null);
  const [fastingHistory, setFastingHistory] = useState<FastingSession[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("16:8");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  // Planos de jejum populares baseados em pesquisas atuais
  const fastingPlans = {
    "16:8": {
      name: "16:8 - Método Clássico",
      fast: 16,
      eat: 8,
      description: "16h jejum, 8h janela alimentar",
      difficulty: "Iniciante",
      benefits: ["Melhora metabolismo", "Perda de peso gradual", "Fácil de manter"],
      color: "bg-green-500"
    },
    "18:6": {
      name: "18:6 - Intermediário",
      fast: 18,
      eat: 6,
      description: "18h jejum, 6h janela alimentar",
      difficulty: "Intermediário",
      benefits: ["Autofagia aumentada", "Maior queima de gordura", "Disciplina mental"],
      color: "bg-yellow-500"
    },
    "20:4": {
      name: "20:4 - Warrior Diet",
      fast: 20,
      eat: 4,
      description: "20h jejum, 4h janela alimentar",
      difficulty: "Avançado",
      benefits: ["Autofagia intensa", "Máxima eficiência", "Concentração elevada"],
      color: "bg-orange-500"
    },
    "24:0": {
      name: "24:0 - OMAD",
      fast: 24,
      eat: 0,
      description: "Uma refeição por dia",
      difficulty: "Expert",
      benefits: ["Máxima simplicidade", "Economia de tempo", "Regeneração celular"],
      color: "bg-red-500"
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            completeFast();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

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
    
    toast({
      title: "🚀 Jejum Iniciado!",
      description: `Jejum ${selectedPlan} começou. Você consegue!`,
      duration: 3000
    });
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
      
      toast({
        title: "🎉 Parabéns! Jejum Concluído!",
        description: `Você completou seu jejum ${selectedPlan}! Continue assim!`,
        duration: 5000
      });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">⏰ Jejum Intermitente</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transforme sua saúde com o poder do jejum intermitente
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
              {isActive ? 'Jejum em andamento...' : 'Jejum pausado'}
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
                <p className="text-sm text-gray-600">
                  {calculateProgress().toFixed(1)}% concluído
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
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(fastingPlans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === key 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <Badge className={plan.color}>{plan.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      <div className="space-y-1">
                        {plan.benefits.map((benefit, index) => (
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Jejum {selectedPlan}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{getStreakCount()}</p>
            <p className="text-sm text-gray-600">Sequência</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{completedFasts}</p>
            <p className="text-sm text-gray-600">Jejuns Completos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{successRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Taxa de Sucesso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{totalFasts}</p>
            <p className="text-sm text-gray-600">Total de Tentativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Information Tabs */}
      <Tabs defaultValue="benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
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
                  <h4 className="font-semibold text-green-600">🔥 Perda de Peso</h4>
                  <p className="text-sm">Acelera o metabolismo e promove a queima de gordura corporal</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">🧠 Saúde Cerebral</h4>
                  <p className="text-sm">Melhora a função cognitiva e pode proteger contra doenças neurodegenerativas</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600">🔄 Autofagia</h4>
                  <p className="text-sm">Processo de limpeza celular que remove componentes danificados</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">❤️ Saúde Cardiovascular</h4>
                  <p className="text-sm">Reduz fatores de risco para doenças cardíacas</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600">📈 Sensibilidade à Insulina</h4>
                  <p className="text-sm">Melhora o controle do açúcar no sangue</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-600">⚡ Níveis de Energia</h4>
                  <p className="text-sm">Energia mais estável ao longo do dia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>💡 Dicas para um Jejum de Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Mantenha-se Hidratado</h4>
                    <p className="text-sm text-gray-600">Beba muita água, chás sem açúcar e café preto</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Comece Gradualmente</h4>
                    <p className="text-sm text-gray-600">Inicie com 12:12 e vá aumentando progressivamente</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Mantenha-se Ocupado</h4>
                    <p className="text-sm text-gray-600">Distraia-se com atividades produtivas durante o jejum</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Quebra de Jejum Inteligente</h4>
                    <p className="text-sm text-gray-600">Comece com alimentos leves e nutritivos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">Ouça seu Corpo</h4>
                    <p className="text-sm text-gray-600">Se sentir mal-estar, interrompa o jejum</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📊 Seu Histórico de Jejuns</CardTitle>
            </CardHeader>
            <CardContent>
              {fastingHistory.length > 0 ? (
                <div className="space-y-3">
                  {fastingHistory.slice(0, 10).map((fast) => (
                    <div key={fast.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${fast.completed ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{fast.type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(fast.startTime).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={fast.completed ? "default" : "secondary"}>
                        {fast.completed ? "Completo" : "Interrompido"}
                      </Badge>
                    </div>
                  ))}
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
