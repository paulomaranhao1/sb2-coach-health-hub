import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedAuthState {
  user: any;
  profile: any;
  loading: boolean;
}

export const useOptimizedAuth = (): OptimizedAuthState => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cache no localStorage para dados críticos
  const getCachedProfile = useCallback((userId: string) => {
    const cached = localStorage.getItem(`profile_${userId}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 5 * 60 * 1000) { // 5 min cache
          return data.profile;
        }
      } catch (error) {
        console.warn('Failed to parse cached profile');
      }
    }
    return null;
  }, []);

  const setCachedProfile = useCallback((userId: string, profileData: any) => {
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify({
        profile: profileData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache profile');
    }
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    // Tentar cache primeiro
    const cachedProfile = getCachedProfile(userId);
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoading(false);
      
      // Atualizar em background
      loadProfileFromDB(userId);
      return;
    }

    // Se não há cache, carregar do banco
    await loadProfileFromDB(userId);
  }, [getCachedProfile]);

  const loadProfileFromDB = useCallback(async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
        setCachedProfile(userId, profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [setCachedProfile]);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        // Limpar cache
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('profile_')) {
            localStorage.removeItem(key);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  return {
    user,
    profile,
    loading
  };
};