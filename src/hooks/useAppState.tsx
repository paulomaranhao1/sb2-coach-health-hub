
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
  
  // Controle de inicialização
  const [initialized, setInitialized] = useState(false);
  const isMountedRef = useRef(true);

  // Verificar tutorial via URL
  useEffect(() => {
    const shouldShowTutorial = searchParams.get('showTutorial');
    if (shouldShowTutorial === 'true') {
      setShowTutorial(true);
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

  // Função principal para verificar perfil - SIMPLIFICADA
  const checkUserProfile = useCallback(async () => {
    if (!isMountedRef.current || initialized) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !isMountedRef.current) {
        console.log('useAppState: Usuário não encontrado');
        if (isMountedRef.current) {
          setIsLoading(false);
          setInitialized(true);
        }
        return;
      }

      console.log('useAppState: Carregando perfil do usuário...');

      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (isMountedRef.current) {
        if (!error && profileData) {
          setUserProfile(profileData);
          // Carregar estatísticas
          await loadUserStats(user.id);
          
          // Definir estado baseado no perfil
          if (!profileData.onboarding_completed) {
            setShowOnboarding(true);
          } else {
            // Usuário já tem perfil completo, mostrar app principal
            setShowWelcome(false);
            setShowOnboarding(false);
          }
        } else {
          // Perfil não encontrado, mostrar welcome
          setShowWelcome(true);
        }
        
        setIsLoading(false);
        setInitialized(true);
      }

    } catch (error) {
      console.error('useAppState: Erro ao verificar perfil:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
        setInitialized(true);
      }
    }
  }, [initialized, loadUserStats]);

  // Handlers simplificados
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
