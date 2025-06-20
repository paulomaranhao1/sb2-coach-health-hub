import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FastingTimer from "./fasting/FastingTimer";
import FastingPlansGrid from "./fasting/FastingPlansGrid";
import FastingStatistics from "./fasting/FastingStatistics";
import FastingGoals from "./fasting/FastingGoals";
import FastingTabs from "./fasting/FastingTabs";

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
      color: "bg-red-500",
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
      {currentFast ? (
        <FastingTimer
          currentFast={currentFast}
          timeRemaining={timeRemaining}
          isActive={isActive}
          onPause={pauseFast}
          onStop={stopFast}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          getMotivationalMessage={getMotivationalMessage}
          fastingPlans={fastingPlans}
        />
      ) : (
        <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Timer className="w-8 h-8" />
              Pronto para Jejuar?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FastingPlansGrid
              fastingPlans={fastingPlans}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              onStartFast={startFast}
            />
          </CardContent>
        </Card>
      )}

      {/* Metas e Progresso */}
      <FastingGoals fastingGoals={fastingGoals} />

      {/* Statistics */}
      <FastingStatistics
        streakCount={getStreakCount()}
        completedFasts={completedFasts}
        successRate={successRate}
        totalHoursFasted={totalHoursFasted}
        totalFasts={totalFasts}
      />

      {/* Information Tabs */}
      <FastingTabs
        notifications={notifications}
        setNotifications={setNotifications}
        reminders={reminders}
        setReminders={setReminders}
        fastingGoals={fastingGoals}
        setFastingGoals={setFastingGoals}
        fastingHistory={fastingHistory}
        totalFasts={totalFasts}
        fastingPlans={fastingPlans}
      />
    </div>
  );
};

export default IntermittentFasting;
