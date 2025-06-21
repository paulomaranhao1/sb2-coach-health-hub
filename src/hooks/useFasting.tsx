
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { FastingSession } from "@/types/fasting";
import { useFastingStorage, loadFastingData } from "./fasting/useFastingStorage";
import { useFastingTimer } from "./fasting/useFastingTimer";
import { 
  getPointsForFast, 
  checkAchievements, 
  calculateFastingProgress, 
  formatTime, 
  getFastingPhase, 
  getStats 
} from "@/utils/fastingUtils";

export * from "@/types/fasting";

export const useFasting = () => {
  const [currentFast, setCurrentFast] = useState<FastingSession | null>(null);
  const [fastingHistory, setFastingHistory] = useState<FastingSession[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use storage hook
  useFastingStorage(currentFast, fastingHistory);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const { currentFast: loadedFast, fastingHistory: loadedHistory } = loadFastingData();
        
        console.log('Carregando dados do jejum:', { loadedFast, loadedHistory });
        
        if (loadedFast) {
          setCurrentFast(loadedFast);
          
          // Calculate remaining time more carefully
          const now = new Date().getTime();
          const startTime = new Date(loadedFast.startTime).getTime();
          const elapsed = Math.floor((now - startTime) / 1000);
          const totalPausedDuration = loadedFast.totalPausedDuration || 0;
          const remaining = Math.max(0, loadedFast.duration - elapsed + totalPausedDuration);
          
          console.log('Cálculo do tempo restante:', {
            now: new Date(now),
            startTime: new Date(startTime),
            elapsed,
            totalPausedDuration,
            duration: loadedFast.duration,
            remaining
          });
          
          setTimeRemaining(remaining);
          
          // Only set as active if there's time remaining and it's not completed
          if (remaining > 0 && !loadedFast.completed) {
            setIsActive(true);
            console.log('Jejum ativo com', remaining, 'segundos restantes');
          } else if (remaining <= 0 && !loadedFast.completed) {
            console.log('Jejum deveria ter terminado, completando automaticamente');
            // Complete the fast if time has run out
            completeFast();
          }
        }
        
        setFastingHistory(loadedHistory);
        setIsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar dados do jejum:', error);
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  const completeFast = useCallback(() => {
    console.log('Completando jejum:', currentFast);
    
    if (currentFast) {
      const completedFast = {
        ...currentFast,
        endTime: new Date(),
        completed: true
      };
      
      setFastingHistory(prev => [completedFast, ...prev]);
      
      // Award points and achievements
      const points = getPointsForFast(currentFast.type);
      toast.success(`🎉 Parabéns! Jejum concluído! +${points} pontos!`, {
        duration: 8000
      });
      
      // Check for achievements
      checkAchievements([completedFast, ...fastingHistory]);
    }
    
    setCurrentFast(null);
    setTimeRemaining(0);
    setIsActive(false);
    setIsPaused(false);
    setPauseStartTime(null);
  }, [currentFast, fastingHistory]);

  // Use timer hook
  useFastingTimer(isActive, isPaused, timeRemaining, setTimeRemaining, currentFast, completeFast);

  const startFast = useCallback((planType: string, duration: number) => {
    const newFast: FastingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration,
      type: planType,
      completed: false,
      totalPausedDuration: 0
    };
    
    console.log('Iniciando novo jejum:', newFast);
    
    setCurrentFast(newFast);
    setTimeRemaining(duration);
    setIsActive(true);
    setIsPaused(false);
    setPauseStartTime(null);
    
    toast.success(`🚀 Jejum ${planType} iniciado! Você consegue!`);
  }, []);

  const pauseFast = useCallback(() => {
    console.log('Pausando/resumindo jejum. Estado atual:', { isPaused, pauseStartTime });
    
    if (isPaused) {
      // Resume
      if (pauseStartTime && currentFast) {
        const pauseDuration = Math.floor((new Date().getTime() - pauseStartTime.getTime()) / 1000);
        const updatedFast = {
          ...currentFast,
          totalPausedDuration: (currentFast.totalPausedDuration || 0) + pauseDuration
        };
        
        console.log('Resumindo jejum, duração da pausa:', pauseDuration);
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
    console.log('Parando jejum:', currentFast);
    
    if (currentFast) {
      const incompleteFast = {
        ...currentFast,
        endTime: new Date(),
        completed: false
      };
      
      setFastingHistory(prev => [incompleteFast, ...prev]);
    }
    
    setCurrentFast(null);
    setTimeRemaining(0);
    setIsActive(false);
    setIsPaused(false);
    setPauseStartTime(null);
    
    toast.warning("🛑 Jejum interrompido. Não desanime, toda tentativa é progresso!");
  }, [currentFast]);

  const calculateProgress = () => calculateFastingProgress(currentFast, timeRemaining);

  // Don't return data until it's loaded to prevent flash of incorrect state
  if (!isLoaded) {
    return {
      currentFast: null,
      fastingHistory: [],
      timeRemaining: 0,
      isActive: false,
      isPaused: false,
      startFast: () => {},
      pauseFast: () => {},
      stopFast: () => {},
      completeFast: () => {},
      calculateProgress: () => 0,
      formatTime,
      getFastingPhase: () => "",
      getStats: () => ({
        totalSessions: 0,
        completedSessions: 0,
        totalHoursFasted: 0,
        longestFast: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageCompletion: 0,
        weeklyAverage: 0
      })
    };
  }

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
    getFastingPhase: () => getFastingPhase(currentFast, timeRemaining),
    getStats: () => getStats(fastingHistory)
  };
};
