
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';

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
    try {
      console.log('useAppState: Carregando estatísticas do usuário...');
      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('useAppState: Erro ao buscar stats:', error);
        return;
      }

      console.log('useAppState: Stats carregadas:', !!stats);
      setUserStats(stats);
    } catch (error) {
      console.error('useAppState: Erro ao carregar stats:', error);
    }
  }, []);

  // Função principal para verificar perfil
  const checkUserProfile = useCallback(async () => {
    if (initialized) return; // Evita múltiplas execuções
    
    console.log('useAppState: Verificando perfil do usuário...');
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('useAppState: Usuário não logado');
        setIsLoading(false);
        setInitialized(true);
        return;
      }

      console.log('useAppState: Usuário logado:', user.id);

      // Carregar perfil
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useAppState: Erro ao buscar perfil:', error);
        setIsLoading(false);
        setInitialized(true);
        return;
      }

      console.log('useAppState: Perfil encontrado:', !!profile);
      setUserProfile(profile);

      // Carregar estatísticas se o perfil existir
      if (profile) {
        await loadUserStats(user.id);
      }

      // Lógica de navegação entre telas
      if (!profile) {
        console.log('useAppState: Sem perfil - mostrando welcome');
        setShowWelcome(true);
        setShowOnboarding(false);
        setShowTutorial(false);
        setShowNewFeatures(false);
      } else if (!profile.onboarding_completed) {
        console.log('useAppState: Onboarding não completo');
        setShowWelcome(false);
        setShowOnboarding(true);
        setShowTutorial(false);
        setShowNewFeatures(false);
      } else {
        console.log('useAppState: Perfil completo - indo para app principal');
        setShowWelcome(false);
        setShowOnboarding(false);
        setShowTutorial(false);
        setShowNewFeatures(false);
      }

    } catch (error) {
      console.error('useAppState: Erro ao verificar perfil:', error);
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  }, [initialized, loadUserStats]);

  // Handlers para fluxo de telas
  const handleOnboardingComplete = useCallback(async () => {
    console.log('useAppState: Onboarding completo');
    setShowOnboarding(false);
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback(async () => {
    console.log('useAppState: Tutorial completo');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTutorialSkip = useCallback(async () => {
    console.log('useAppState: Tutorial pulado');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  // Handler para mudança de aba
  const handleTabChange = useCallback((tab: string) => {
    console.log('useAppState: Mudando para aba:', tab);
    setActiveTab(tab);
    setSearchParams({ tab });
    setShowMobileMenu(false);
  }, [setSearchParams]);

  // Handler para navegação home
  const handleNavigateToHome = useCallback(() => {
    console.log('useAppState: Navegando para home');
    navigate('/');
    setActiveTab('home');
    setSearchParams({});
  }, [navigate, setSearchParams]);

  // Sincronizar tab com URL params (apenas uma vez)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      console.log('useAppState: Sincronizando tab da URL:', tab);
      setActiveTab(tab);
    }
  }, [searchParams]); // Removido activeTab da dependência para evitar loop

  return {
    // Estados principais
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
    
    // Dados do usuário
    userProfile,
    setUserProfile,
    userStats,
    setUserStats,
    
    // Estados de loading
    isLoading,
    setIsLoading,
    
    // Tema
    theme,
    toggleTheme,
    
    // Funções principais
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome,
    
    // Função para recarregar stats
    loadUserStats
  };
};
