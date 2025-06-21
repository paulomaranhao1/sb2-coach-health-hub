
import { FastingSession, FastingStats } from "@/types/fasting";
import { toast } from "sonner";

export const getPointsForFast = (type: string): number => {
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

export const calculateCurrentStreak = (history: FastingSession[]): number => {
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

export const checkAchievements = (history: FastingSession[]) => {
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

export const calculateFastingProgress = (currentFast: FastingSession | null, timeRemaining: number): number => {
  if (!currentFast || timeRemaining === 0) return 0;
  const elapsed = currentFast.duration - timeRemaining;
  return Math.min(100, (elapsed / currentFast.duration) * 100);
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getFastingPhase = (currentFast: FastingSession | null, timeRemaining: number): string => {
  if (!currentFast) return "";
  
  const elapsed = currentFast.duration - timeRemaining;
  const hours = elapsed / 3600;
  
  if (hours < 4) return "🍽️ Digestão";
  if (hours < 12) return "⚡ Glicogênio";
  if (hours < 18) return "🔥 Cetose Inicial";
  if (hours < 24) return "🧬 Autofagia";
  return "💎 Cetose Profunda";
};

export const getStats = (fastingHistory: FastingSession[]): FastingStats => {
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
