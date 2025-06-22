import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';
import { useDataCache } from './useDataCache';

interface AppState {
  showWelcome: boolean;
  showOnboarding: boolean;
  showTutorial: boolean;
  showNewFeatures: boolean;
  activeTab: string;
  showMobileMenu: boolean;
  userProfile: UserProfile | null;
  userStats: UserStats | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  showWelcome: false,
  showOnboarding: false,
  showTutorial: false,
  showNewFeatures: false,
  activeTab: 'home',
  showMobileMenu: false,
  userProfile: null,
  userStats: null,
  isLoading: false,
  theme: 'light',
};

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { get: getCache, set: setCache, has: hasCache } = useDataCache({ defaultTTL: 10 * 60 * 1000 });
  
  // Estados básicos
  const [showWelcome, setShowWelcome] = useState(initialState.showWelcome);
  const [showOnboarding, setShowOnboarding] = useState(initialState.showOnboarding);
  const [showTutorial, setShowTutorial] = useState(initialState.showTutorial);
  const [showNewFeatures, setShowNewFeatures] = useState(initialState.showNewFeatures);
  const [activeTab, setActiveTab] = useState(initialState.activeTab);
  const [showMobileMenu, setShowMobileMenu] = useState(initialState.showMobileMenu);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialState.userProfile);
  const [userStats, setUserStats] = useState<UserStats | null>(initialState.userStats);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem('theme') as 'light' | 'dark') || initialState.theme);
  const [initialized, setInitialized] = useState(false);
  
  // Refs para controle
  const isMountedRef = useRef(true);
  const profileLoadingRef = useRef(false);

  // Verificar se deve mostrar tutorial via URL
  useEffect(() => {
    const shouldShowTutorial = searchParams.get('showTutorial');
    if (shouldShowTutorial === 'true') {
      setShowTutorial(true);
      // Limpar o parâmetro da URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('showTutorial');
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams]);

  // Controle de tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Função para carregar stats do usuário
  const loadUserStats = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      const cacheKey = `user_stats_${userId}`;
      
      if (hasCache(cacheKey)) {
        const cachedStats = getCache<UserStats>(cacheKey);
        if (cachedStats && isMountedRef.current) {
          setUserStats(cachedStats);
          return;
        }
      }

      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('useAppState: Erro ao buscar stats:', error);
        return;
      }

      if (stats && isMountedRef.current) {
        setCache(cacheKey, stats);
        setUserStats(stats);
      }
    } catch (error) {
      console.error('useAppState: Erro ao carregar stats:', error);
    }
  }, [getCache, setCache, hasCache]);

  // Função principal para verificar perfil
  const checkUserProfile = useCallback(async () => {
    if (!isMountedRef.current || initialized || profileLoadingRef.current) {
      return;
    }
    
    profileLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !isMountedRef.current) {
        if (isMountedRef.current) {
          setIsLoading(false);
          setInitialized(true);
        }
        return;
      }

      const cacheKey = `user_profile_${user.id}`;
      let profile = null;

      // Tentar cache primeiro
      if (hasCache(cacheKey)) {
        profile = getCache<UserProfile>(cacheKey);
        if (profile && isMountedRef.current) {
          setUserProfile(profile);
        }
      }

      // Se não tem cache, buscar do banco
      if (!profile) {
        const { data: profileData, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && profileData && isMountedRef.current) {
          setCache(cacheKey, profileData);
          setUserProfile(profileData);
          profile = profileData;
        }
      }

      // Carregar estatísticas
      if (profile && isMountedRef.current) {
        await loadUserStats(user.id);
      }

      // Lógica de navegação
      if (isMountedRef.current) {
        if (!profile) {
          setShowWelcome(true);
          setShowOnboarding(false);
          setShowTutorial(false);
          setShowNewFeatures(false);
        } else if (!profile.onboarding_completed) {
          setShowWelcome(false);
          setShowOnboarding(true);
          setShowTutorial(false);
          setShowNewFeatures(false);
        } else {
          setShowWelcome(false);
          setShowOnboarding(false);
          setShowTutorial(false);
          setShowNewFeatures(false);
        }
      }

    } catch (error) {
      console.error('useAppState: Erro ao verificar perfil:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setInitialized(true);
      }
      profileLoadingRef.current = false;
    }
  }, [initialized, loadUserStats, getCache, setCache, hasCache]);

  // Handlers memoizados
  const handleOnboardingComplete = useCallback(async () => {
    setShowOnboarding(false);
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback(async () => {
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTutorialSkip = useCallback(async () => {
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setShowMobileMenu(false);
  }, [setSearchParams]);

  const handleNavigateToHome = useCallback(() => {
    navigate('/');
    setActiveTab('home');
    setSearchParams({});
  }, [navigate, setSearchParams]);

  // Sincronizar tab com URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Retorno memoizado
  return useMemo(() => ({
    showWelcome,
    setShowWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    setShowNewFeatures,
    activeTab,
    setActiveTab,
    showMobileMenu,
    setShowMobileMenu,
    userProfile,
    setUserProfile,
    userStats,
    setUserStats,
    isLoading,
    setIsLoading,
    theme,
    toggleTheme,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome,
    loadUserStats
  }), [
    showWelcome, showOnboarding, showTutorial, showNewFeatures, activeTab, showMobileMenu,
    userProfile, userStats, isLoading, theme, toggleTheme, checkUserProfile,
    handleOnboardingComplete, handleTutorialComplete, handleTutorialSkip,
    handleTabChange, handleNavigateToHome, loadUserStats
  ]);
};
