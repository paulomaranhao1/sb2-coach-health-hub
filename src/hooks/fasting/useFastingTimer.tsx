
import { useEffect } from "react";
import { FastingSession } from "@/types/fasting";
import { toast } from "sonner";

export const useFastingTimer = (
  isActive: boolean,
  isPaused: boolean,
  timeRemaining: number,
  setTimeRemaining: (value: number | ((prev: number) => number)) => void,
  currentFast: FastingSession | null,
  completeFast: () => void
) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          console.log('Timer tick:', { prev, newTime, isActive, isPaused });
          
          // Check for completion
          if (newTime <= 0) {
            console.log('Timer concluído, chamando completeFast');
            completeFast();
            return 0;
          }
          
          // Motivational notifications at key milestones
          if (currentFast && newTime > 0) {
            const progress = ((currentFast.duration - newTime) / currentFast.duration) * 100;
            const prevProgress = ((currentFast.duration - prev) / currentFast.duration) * 100;
            
            if (Math.floor(progress) === 25 && Math.floor(prevProgress) === 24) {
              toast.success("🌱 25% concluído! Você está no caminho certo!");
            } else if (Math.floor(progress) === 50 && Math.floor(prevProgress) === 49) {
              toast.success("🔥 Meio caminho andado! Continue firme!");
            } else if (Math.floor(progress) === 75 && Math.floor(prevProgress) === 74) {
              toast.success("💪 75% completo! Você é incrível!");
            } else if (Math.floor(progress) === 90 && Math.floor(prevProgress) === 89) {
              toast.success("🏃‍♂️ Faltam apenas 10%! Reta final!");
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, timeRemaining, currentFast, completeFast, setTimeRemaining]);
};
