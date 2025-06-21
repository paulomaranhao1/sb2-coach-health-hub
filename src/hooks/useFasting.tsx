import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: string;
  completed: boolean;
  pausedTime?: number;
  totalPausedDuration?: number;
  mood?: string;
  energy?: number;
  notes?: string;
}

export interface FastingStats {
  totalSessions: number;
  completedSessions: number;
  totalHoursFasted: number;
  longestFast: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletion: number;
  weeklyAverage: number;
}

export const useFasting = () => {
  const [currentFast, setCurrentFast] = useState<FastingSession | null>(null);
  const [fastingHistory, setFastingHistory] = useState<FastingSession[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);

  // Save to Supabase
  const saveFastingSessionToSupabase = async (session: FastingSession) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('fasting_sessions')
        .upsert({
          id: session.id,
          user_id: user.id,
          start_time: session.startTime.toISOString(),
          end_time: session.endTime?.toISOString(),
          duration: session.duration,
          type: session.type,
          completed: session.completed,
          paused_time: session.pausedTime,
          total_paused_duration: session.totalPausedDuration,
          mood: session.mood,
          energy: session.energy,
          notes: session.notes
        });

      if (error) {
        console.error('Erro ao salvar jejum no Supabase:', error);
      } else {
        console.log('✅ Jejum salvo no Supabase com sucesso');
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
    }
  };

  // Load from Supabase
  const loadFastingDataFromSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar sessão ativa
      const { data: activeSessions } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('start_time', { ascending: false })
        .limit(1);

      if (activeSessions && activeSessions.length > 0) {
        const session = activeSessions[0];
        const fastingSession: FastingSession = {
          id: session.id,
          startTime: new Date(session.start_time),
          endTime: session.end_time ? new Date(session.end_time) : undefined,
          duration: session.duration,
          type: session.type,
          completed: session.completed,
          pausedTime: session.paused_time,
          totalPausedDuration: session.total_paused_duration,
          mood: session.mood,
          energy: session.energy,
          notes: session.notes
        };

        setCurrentFast(fastingSession);
        
        // Calculate remaining time
        const now = new Date().getTime();
        const startTime = new Date(session.start_time).getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, session.duration - elapsed - (session.total_paused_duration || 0));
        
        setTimeRemaining(remaining);
        
        if (remaining > 0) {
          setIsActive(true);
        }
      }

      // Carregar histórico
      const { data: history } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (history) {
        const historyData = history.map(session => ({
          id: session.id,
          startTime: new Date(session.start_time),
          endTime: session.end_time ? new Date(session.end_time) : undefined,
          duration: session.duration,
          type: session.type,
          completed: session.completed,
          pausedTime: session.paused_time,
          totalPausedDuration: session.total_paused_duration,
          mood: session.mood,
          energy: session.energy,
          notes: session.notes
        }));
        setFastingHistory(historyData);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    // Primeiro tentar carregar do Supabase
    loadFastingDataFromSupabase();

    // Fallback para localStorage
    const savedCurrentFast = localStorage.getItem('sb2_current_fast');
    const savedHistory = localStorage.getItem('sb2_fasting_history');
    
    if (savedCurrentFast && !currentFast) {
      const fast = JSON.parse(savedCurrentFast);
      fast.startTime = new Date(fast.startTime);
      if (fast.endTime) fast.endTime = new Date(fast.endTime);
      
      setCurrentFast(fast);
      
      // Calculate remaining time
      const now = new Date().getTime();
      const startTime = new Date(fast.startTime).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, fast.duration - elapsed - (fast.totalPausedDuration || 0));
      
      setTimeRemaining(remaining);
      
      if (remaining > 0 && !fast.completed) {
        setIsActive(true);
      }
    }
    
    if (savedHistory && fastingHistory.length === 0) {
      const history = JSON.parse(savedHistory);
      history.forEach((session: FastingSession) => {
        session.startTime = new Date(session.startTime);
        if (session.endTime) session.endTime = new Date(session.endTime);
      });
      setFastingHistory(history);
    }
  }, []);

  // Save current fast to localStorage and Supabase
  useEffect(() => {
    if (currentFast) {
      localStorage.setItem('sb2_current_fast', JSON.stringify(currentFast));
      saveFastingSessionToSupabase(currentFast);
    } else {
      localStorage.removeItem('sb2_current_fast');
    }
  }, [currentFast]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('sb2_fasting_history', JSON.stringify(fastingHistory));
  }, [fastingHistory]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Check for completion
          if (newTime <= 0) {
            completeFast();
            return 0;
          }
          
          // Motivational notifications at key milestones
          if (currentFast) {
            const progress = ((currentFast.duration - newTime) / currentFast.duration) * 100;
            
            if (Math.floor(progress) === 25 && Math.floor(((currentFast.duration - prev) / currentFast.duration) * 100) === 24) {
              toast.success("🌱 25% concluído! Você está no caminho certo!");
            } else if (Math.floor(progress) === 50 && Math.floor(((currentFast.duration - prev) / currentFast.duration) * 100) === 49) {
              toast.success("🔥 Meio caminho andado! Continue firme!");
            } else if (Math.floor(progress) === 75 && Math.floor(((currentFast.duration - prev) / currentFast.duration) * 100) === 74) {
              toast.success("💪 75% completo! Você é incrível!");
            } else if (Math.floor(progress) === 90 && Math.floor(((currentFast.duration - prev) / currentFast.duration) * 100) === 89) {
              toast.success("🏃‍♂️ Faltam apenas 10%! Reta final!");
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, currentFast]);

  const startFast = useCallback((planType: string, duration: number) => {
    const newFast: FastingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration,
      type: planType,
      completed: false,
      totalPausedDuration: 0
    };
    
    setCurrentFast(newFast);
    setTimeRemaining(duration);
    setIsActive(true);
    setIsPaused(false);
    
    toast.success(`🚀 Jejum ${planType} iniciado! Você consegue!`);
  }, []);

  const pauseFast = useCallback(() => {
    if (isPaused) {
      // Resume
      if (pauseStartTime && currentFast) {
        const pauseDuration = Math.floor((new Date().getTime() - pauseStartTime.getTime()) / 1000);
        const updatedFast = {
          ...currentFast,
          totalPausedDuration: (currentFast.totalPausedDuration || 0) + pauseDuration
        };
        setCurrentFast(updatedFast);
      }
      setIsPaused(false);
      setPauseStartTime(null);
      toast.success("▶️ Jejum retomado!");
    } else {
      // Pause
      setIsPaused(true);
      setPauseStartTime(new Date());
      toast.info("⏸️ Jejum pausado");
    }
  }, [isPaused, pauseStartTime, currentFast]);

  const stopFast = useCallback(() => {
    if (currentFast) {
      const incompleteFast = {
        ...currentFast,
        endTime: new Date(),
        completed: false
      };
      
      setFastingHistory(prev => [incompleteFast, ...prev]);
      saveFastingSessionToSupabase(incompleteFast);
    }
    
    setCurrentFast(null);
    setTimeRemaining(0);
    setIsActive(false);
    setIsPaused(false);
    setPauseStartTime(null);
    
    toast.warning("🛑 Jejum interrompido. Não desanime, toda tentativa é progresso!");
  }, [currentFast]);

  const completeFast = useCallback(() => {
    if (currentFast) {
      const completedFast = {
        ...currentFast,
        endTime: new Date(),
        completed: true
      };
      
      setFastingHistory(prev => [completedFast, ...prev]);
      saveFastingSessionToSupabase(completedFast);
      
      // Award points and achievements
      const points = getPointsForFast(currentFast.type);
      toast.success(`🎉 Parabéns! Jejum concluído! +${points} pontos!`, {
        duration: 8000
      });
      
      // Check for achievements
      checkAchievements([completedFast, ...fastingHistory]);
    }
    
    setCurrentFast(null);
    setIsActive(false);
    setIsPaused(false);
    setPauseStartTime(null);
  }, [currentFast, fastingHistory]);

  const getPointsForFast = (type: string): number => {
    const pointsMap: { [key: string]: number } = {
      "12:12": 20,
      "14:10": 30,
      "16:8": 50,
      "18:6": 70,
      "20:4": 100,
      "24:0": 150,
      "36:12": 250
    };
    return pointsMap[type] || 50;
  };

  const checkAchievements = (history: FastingSession[]) => {
    const completedFasts = history.filter(f => f.completed);
    const streak = calculateCurrentStreak(history);
    
    // First fast achievement
    if (completedFasts.length === 1) {
      toast.success("🏆 Primeira Conquista: Primeiro Jejum Completo!");
    }
    
    // Streak achievements
    if (streak === 7) {
      toast.success("🔥 Conquista: 7 dias de streak!");
    } else if (streak === 30) {
      toast.success("💎 Conquista Diamante: 30 dias de streak!");
    }
    
    // Milestone achievements
    if (completedFasts.length === 10) {
      toast.success("⭐ Conquista: 10 Jejuns Completos!");
    } else if (completedFasts.length === 50) {
      toast.success("🌟 Conquista Elite: 50 Jejuns Completos!");
    }
  };

  const calculateCurrentStreak = (history: FastingSession[]): number => {
    const completedFasts = history
      .filter(f => f.completed)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (const fast of completedFasts) {
      const fastDate = new Date(fast.startTime);
      const daysDiff = Math.floor((today.getTime() - fastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateProgress = (): number => {
    if (!currentFast || timeRemaining === 0) return 0;
    const elapsed = currentFast.duration - timeRemaining;
    return Math.min(100, (elapsed / currentFast.duration) * 100);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFastingPhase = (): string => {
    if (!currentFast) return "";
    
    const elapsed = currentFast.duration - timeRemaining;
    const hours = elapsed / 3600;
    
    if (hours < 4) return "🍽️ Digestão";
    if (hours < 12) return "⚡ Glicogênio";
    if (hours < 18) return "🔥 Cetose Inicial";
    if (hours < 24) return "🧬 Autofagia";
    return "💎 Cetose Profunda";
  };

  const getStats = (): FastingStats => {
    const completed = fastingHistory.filter(f => f.completed);
    const totalHours = completed.reduce((sum, f) => sum + (f.duration / 3600), 0);
    const longestFast = Math.max(...completed.map(f => f.duration), 0);
    
    return {
      totalSessions: fastingHistory.length,
      completedSessions: completed.length,
      totalHoursFasted: totalHours,
      longestFast: longestFast / 3600,
      currentStreak: calculateCurrentStreak(fastingHistory),
      longestStreak: calculateCurrentStreak(fastingHistory), // Simplified for now
      averageCompletion: fastingHistory.length > 0 ? (completed.length / fastingHistory.length) * 100 : 0,
      weeklyAverage: completed.length / Math.max(1, Math.ceil(fastingHistory.length / 7))
    };
  };

  return {
    currentFast,
    fastingHistory,
    timeRemaining,
    isActive,
    isPaused,
    startFast,
    pauseFast,
    stopFast,
    completeFast,
    calculateProgress,
    formatTime,
    getFastingPhase,
    getStats
  };
};
