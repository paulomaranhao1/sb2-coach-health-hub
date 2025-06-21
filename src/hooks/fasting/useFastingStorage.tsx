
import { useEffect } from "react";
import { FastingSession } from "@/types/fasting";

export const useFastingStorage = (
  currentFast: FastingSession | null,
  fastingHistory: FastingSession[]
) => {
  // Save current fast to localStorage
  useEffect(() => {
    if (currentFast) {
      localStorage.setItem('sb2_current_fast', JSON.stringify(currentFast));
    } else {
      localStorage.removeItem('sb2_current_fast');
    }
  }, [currentFast]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('sb2_fasting_history', JSON.stringify(fastingHistory));
  }, [fastingHistory]);
};

export const loadFastingData = () => {
  const savedCurrentFast = localStorage.getItem('sb2_current_fast');
  const savedHistory = localStorage.getItem('sb2_fasting_history');
  
  let currentFast = null;
  let fastingHistory: FastingSession[] = [];
  
  if (savedCurrentFast) {
    const fast = JSON.parse(savedCurrentFast);
    fast.startTime = new Date(fast.startTime);
    if (fast.endTime) fast.endTime = new Date(fast.endTime);
    currentFast = fast;
  }
  
  if (savedHistory) {
    const history = JSON.parse(savedHistory);
    history.forEach((session: FastingSession) => {
      session.startTime = new Date(session.startTime);
      if (session.endTime) session.endTime = new Date(session.endTime);
    });
    fastingHistory = history;
  }
  
  return { currentFast, fastingHistory };
};
