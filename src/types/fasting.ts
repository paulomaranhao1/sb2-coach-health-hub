
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
