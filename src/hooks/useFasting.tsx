
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FastingSession {
  id: string;
  user_id: string;
  start_time: string;
  duration: number;
  type: string;
  completed: boolean;
  paused_time?: number;
  total_paused_duration?: number;
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

      // Buscar histórico (silencioso)
      const { data: history } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

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

  const calculateProgress = useCallback((current: number, total: number) => {
    return Math.max(0, Math.min(100, ((total - current) / total) * 100));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getFastingPhase = useCallback((elapsed: number, total: number) => {
    const percentage = (elapsed / total) * 100;
    if (percentage < 25) return 'Início';
    if (percentage < 50) return 'Queima de Glicose';
    if (percentage < 75) return 'Cetose Inicial';
    return 'Cetose Profunda';
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
    stopFast,
    calculateProgress,
    formatTime,
    getFastingPhase,
    refetch: loadFastingData
  };
};
