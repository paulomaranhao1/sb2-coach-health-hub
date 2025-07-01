
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FastingSession {
  id: string;
  user_id: string;
  start_time: string;
  duration: number;
  type: string;
  completed: boolean;
  paused_time?: number;
  total_paused_duration?: number;
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
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadFastingData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoaded(true);
        return;
      }

      // Buscar jejum ativo
      const { data: activeFast } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeFast) {
        setCurrentFast(activeFast);
        const startTime = new Date(activeFast.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, activeFast.duration - elapsed);
        
        setTimeRemaining(remaining);
        setIsActive(remaining > 0);
        setIsPaused(!!activeFast.paused_time);
      } else {
        // Limpar localStorage apenas se necessário
        const localFast = localStorage.getItem('currentFast');
        if (localFast) {
          localStorage.removeItem('currentFast');
        }
      }
    } catch (error) {
      // Silently handle errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFastingData();
  }, [loadFastingData]);

  const startFast = useCallback(async (type: string, duration: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: newFast } = await supabase
        .from('fasting_sessions')
        .insert({
          user_id: user.id,
          type,
          duration,
          start_time: new Date().toISOString(),
          completed: false
        })
        .select()
        .single();

      if (newFast) {
        setCurrentFast(newFast);
        setTimeRemaining(duration);
        setIsActive(true);
        setIsPaused(false);
      }
    } catch (error) {
      // Silently handle error
    }
  }, []);

  const stopFast = useCallback(async () => {
    if (!currentFast) return;

    try {
      await supabase
        .from('fasting_sessions')
        .update({ completed: true })
        .eq('id', currentFast.id);

      setCurrentFast(null);
      setTimeRemaining(0);
      setIsActive(false);
      setIsPaused(false);
      
      localStorage.removeItem('currentFast');
    } catch (error) {
      // Silently handle error
    }
  }, [currentFast]);

  const calculateProgress = useCallback(() => {
    if (!currentFast || timeRemaining === 0) return 0;
    const elapsed = currentFast.duration - timeRemaining;
    return Math.min(100, (elapsed / currentFast.duration) * 100);
  }, [currentFast, timeRemaining]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getFastingPhase = useCallback(() => {
    if (!currentFast) return "";
    
    const elapsed = currentFast.duration - timeRemaining;
    const hours = elapsed / 3600;
    
    if (hours < 4) return "🍽️ Digestão";
    if (hours < 12) return "⚡ Glicogênio";
    if (hours < 18) return "🔥 Cetose Inicial";
    if (hours < 24) return "🧬 Autofagia";
    return "💎 Cetose Profunda";
  }, [currentFast, timeRemaining]);

  const getStats = useCallback(async (): Promise<FastingStats> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          totalHoursFasted: 0,
          longestFast: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageCompletion: 0,
          weeklyAverage: 0
        };
      }

      const { data: sessions } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!sessions || sessions.length === 0) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          totalHoursFasted: 0,
          longestFast: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageCompletion: 0,
          weeklyAverage: 0
        };
      }

      const completed = sessions.filter(s => s.completed);
      const totalHours = completed.reduce((sum, s) => sum + (s.duration / 3600), 0);
      const longestFast = Math.max(...completed.map(s => s.duration), 0);

      return {
        totalSessions: sessions.length,
        completedSessions: completed.length,
        totalHoursFasted: totalHours,
        longestFast: longestFast / 3600,
        currentStreak: 0, // Simplified for now
        longestStreak: 0, // Simplified for now
        averageCompletion: sessions.length > 0 ? (completed.length / sessions.length) * 100 : 0,
        weeklyAverage: completed.length / Math.max(1, Math.ceil(sessions.length / 7))
      };
    } catch (error) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalHoursFasted: 0,
        longestFast: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageCompletion: 0,
        weeklyAverage: 0
      };
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  return {
    currentFast,
    timeRemaining,
    isActive,
    isPaused,
    isLoaded,
    startFast,
    stopFast,
    calculateProgress,
    formatTime,
    getFastingPhase,
    getStats,
    refetch: loadFastingData
  };
};
