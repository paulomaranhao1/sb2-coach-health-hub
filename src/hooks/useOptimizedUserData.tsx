
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedCache } from '@/hooks/useUnifiedCache';
import { useLogger } from '@/utils/logger';

export interface OptimizedUserData {
  profile: {
    user_id: string;
    name: string;
    email: string;
    weight: number;
    height: number;
    age: number;
    gender: string;
    goal_weight: number;
    onboarding_completed: boolean;
    auth_provider: string;
  } | null;
  stats: {
    points: number;
    level: number;
    streak: number;
    shields: string[];
    stickers: string[];
    last_activity_date: string;
    total_photos_analyzed: number;
    total_calories_tracked: number;
  } | null;
  subscription: {
    subscription_type: string;
    subscription_active: boolean;
    subscription_expires_at: string;
  } | null;
  weightEntries: Array<{
    id: string;
    weight: number;
    date: string;
    created_at: string;
    notes?: string;
  }>;
  progressStats: {
    currentWeight: number;
    initialWeight: number;
    weightLoss: number;
    avgWeightLossPerWeek: string;
    consistencyScore: number;
    weightEntriesCount: number;
  };
}

export const useOptimizedUserData = () => {
  const [data, setData] = useState<OptimizedUserData>({
    profile: null,
    stats: null,
    subscription: null,
    weightEntries: [],
    progressStats: {
      currentWeight: 0,
      initialWeight: 0,
      weightLoss: 0,
      avgWeightLossPerWeek: "0.0",
      consistencyScore: 0,
      weightEntriesCount: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const cache = useUnifiedCache();
  const logger = useLogger('useOptimizedUserData');

  const loadUserData = useCallback(async (useCache = true) => {
    const startTime = Date.now();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const cacheKey = `optimized-user-data-${user.id}`;
      
      // Verificar cache primeiro
      if (useCache) {
        const cachedData = cache.get<OptimizedUserData>(cacheKey);
        if (cachedData) {
          logger.info('Using cached user data');
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      logger.info('Loading user data from server');

      // Buscar dados em paralelo para melhor performance
      const [profileResponse, statsResponse, subscriptionResponse, weightResponse] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50) // Limitar para melhor performance
      ]);

      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') throw profileResponse.error;
      if (statsResponse.error && statsResponse.error.code !== 'PGRST116') throw statsResponse.error;
      if (subscriptionResponse.error && subscriptionResponse.error.code !== 'PGRST116') throw subscriptionResponse.error;
      if (weightResponse.error) throw weightResponse.error;

      const weightEntries = weightResponse.data || [];
      
      // Calcular estatísticas de progresso
      const progressStats = calculateProgressStats(weightEntries);

      // Mapear subscription para o formato correto
      const subscription = subscriptionResponse.data ? {
        subscription_type: subscriptionResponse.data.subscription_type,
        subscription_active: subscriptionResponse.data.is_active,
        subscription_expires_at: subscriptionResponse.data.expires_at || ''
      } : null;

      const newData: OptimizedUserData = {
        profile: profileResponse.data,
        stats: statsResponse.data,
        subscription,
        weightEntries,
        progressStats
      };

      setData(newData);
      setError(null);
      
      // Salvar no cache por 2 minutos (dados dinâmicos)
      cache.set(cacheKey, newData, { 
        ttl: 2 * 60 * 1000, 
        tags: ['user-data', 'optimized'],
        priority: 'high'
      });

      const elapsedTime = Date.now() - startTime;
      logger.info('User data loaded successfully', { elapsedTime });

    } catch (error: any) {
      logger.error('Failed to load user data', { error });
      setError(error.message || 'Erro ao carregar dados');
      toast({
        title: "Erro ao carregar dados",
        description: error.message || 'Erro inesperado',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, cache, logger]);

  const calculateProgressStats = useMemo(() => (weightEntries: any[]) => {
    if (weightEntries.length === 0) {
      return {
        currentWeight: 0,
        initialWeight: 0,
        weightLoss: 0,
        avgWeightLossPerWeek: "0.0",
        consistencyScore: 0,
        weightEntriesCount: 0
      };
    }

    const currentWeight = weightEntries[0]?.weight || 0;
    const initialWeight = weightEntries[weightEntries.length - 1]?.weight || 0;
    const weightLoss = Math.max(0, initialWeight - currentWeight);
    
    let avgWeightLossPerWeek = "0.0";
    if (weightEntries.length >= 2) {
      const firstDate = new Date(weightEntries[weightEntries.length - 1].date);
      const lastDate = new Date(weightEntries[0].date);
      const daysDiff = Math.abs(lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      const weeksDiff = daysDiff / 7;
      
      if (weeksDiff > 0) {
        avgWeightLossPerWeek = (weightLoss / weeksDiff).toFixed(1);
      }
    }

    // Calcular consistência dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEntries = weightEntries.filter(entry => 
      new Date(entry.date) >= sevenDaysAgo
    );
    const consistencyScore = Math.round((recentEntries.length / 7) * 100);

    return {
      currentWeight,
      initialWeight,
      weightLoss,
      avgWeightLossPerWeek,
      consistencyScore,
      weightEntriesCount: weightEntries.length
    };
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Função para invalidar cache específico
  const invalidateUserData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      cache.delete(`optimized-user-data-${user.id}`);
    }
    loadUserData(false);
  }, [cache, loadUserData]);

  // Função para atualizar dados específicos sem refetch completo
  const updateUserStats = useCallback((newStats: Partial<typeof data.stats>) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats ? { ...prev.stats, ...newStats } : null
    }));
  }, []);

  return {
    data,
    loading,
    error,
    refetch: loadUserData,
    invalidateUserData,
    updateUserStats
  };
};
