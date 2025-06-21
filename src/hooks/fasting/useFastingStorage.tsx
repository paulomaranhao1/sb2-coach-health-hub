
import { useEffect } from "react";
import { FastingSession } from "@/types/fasting";

export const useFastingStorage = (
  currentFast: FastingSession | null,
  fastingHistory: FastingSession[]
) => {
  // Save history to localStorage
  useEffect(() => {
    if (fastingHistory.length > 0) {
      localStorage.setItem('sb2_fasting_history', JSON.stringify(fastingHistory));
    }
  }, [fastingHistory]);
};

export const loadFastingData = () => {
  const savedCurrentFast = localStorage.getItem('sb2_current_fast');
  const savedHistory = localStorage.getItem('sb2_fasting_history');
  
  let currentFast = null;
  let fastingHistory: FastingSession[] = [];
  
  if (savedCurrentFast) {
    try {
      const fast = JSON.parse(savedCurrentFast);
      fast.startTime = new Date(fast.startTime);
      if (fast.endTime) fast.endTime = new Date(fast.endTime);
      currentFast = fast;
    } catch (error) {
      console.error('Erro ao carregar jejum atual:', error);
      localStorage.removeItem('sb2_current_fast');
    }
  }
  
  if (savedHistory) {
    try {
      const history = JSON.parse(savedHistory);
      history.forEach((session: FastingSession) => {
        session.startTime = new Date(session.startTime);
        if (session.endTime) session.endTime = new Date(session.endTime);
      });
      fastingHistory = history;
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      localStorage.removeItem('sb2_fasting_history');
    }
  }
  
  return { currentFast, fastingHistory };
};
