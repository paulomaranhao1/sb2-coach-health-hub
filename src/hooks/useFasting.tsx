
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

  // Use storage hook
  useFastingStorage(currentFast, fastingHistory);

  // Load data from localStorage on mount
  useEffect(() => {
    const { currentFast: loadedFast, fastingHistory: loadedHistory } = loadFastingData();
    
    if (loadedFast) {
      setCurrentFast(loadedFast);
      
      // Calculate remaining time
      const now = new Date().getTime();
      const startTime = new Date(loadedFast.startTime).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, loadedFast.duration - elapsed - (loadedFast.totalPausedDuration || 0));
      
      setTimeRemaining(remaining);
      
      if (remaining > 0 && !loadedFast.completed) {
        setIsActive(true);
      }
    }
    
    setFastingHistory(loadedHistory);
  }, []);

  const completeFast = useCallback(() => {
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
    setIsActive(false);
    setIsPaused(false);
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
    }
    
    setCurrentFast(null);
    setTimeRemaining(0);
    setIsActive(false);
    setIsPaused(false);
    setPauseStartTime(null);
    
    toast.warning("🛑 Jejum interrompido. Não desanime, toda tentativa é progresso!");
  }, [currentFast]);

  const calculateProgress = () => calculateFastingProgress(currentFast, timeRemaining);

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
