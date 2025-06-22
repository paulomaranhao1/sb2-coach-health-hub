
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados básicos
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNewFeatures, setShowNewFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  
  // Verificar tutorial via URL apenas uma vez
  useEffect(() => {
    const shouldShowTutorial = searchParams.get('showTutorial');
    if (shouldShowTutorial === 'true') {
      console.log('useAppState: Tutorial solicitado via URL');
      setShowTutorial(true);
      // Limpar URL
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

  // Função simplificada para verificar perfil - só executa quando solicitado
  const checkUserProfile = useCallback(async () => {
    console.log('useAppState: Verificando perfil do usuário...');
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('useAppState: Usuário não encontrado');
        setIsLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        console.log('useAppState: Perfil encontrado:', profileData.name);
        setUserProfile(profileData);
        
        if (!profileData.onboarding_completed) {
          setShowOnboarding(true);
        }
        
        // Carregar stats em background sem bloquear
        setTimeout(async () => {
          const { data: stats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (stats) {
            setUserStats(stats);
          }
        }, 0);
      } else {
        console.log('useAppState: Perfil não encontrado, mostrar welcome');
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('useAppState: Erro ao verificar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handlers otimizados
  const handleOnboardingComplete = useCallback(() => {
    console.log('useAppState: Onboarding completado');
    setShowOnboarding(false);
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback(() => {
    console.log('useAppState: Tutorial completado');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTutorialSkip = useCallback(() => {
    console.log('useAppState: Tutorial pulado');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    console.log('useAppState: Mudando para tab:', tab);
    setActiveTab(tab);
    setSearchParams({ tab });
    setShowMobileMenu(false);
  }, [setSearchParams]);

  const handleNavigateToHome = useCallback(() => {
    console.log('useAppState: Navegando para home');
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
    handleNavigateToHome
  }), [
    showWelcome, showOnboarding, showTutorial, showNewFeatures, activeTab, showMobileMenu,
    userProfile, userStats, isLoading, theme, toggleTheme, checkUserProfile,
    handleOnboardingComplete, handleTutorialComplete, handleTutorialSkip,
    handleTabChange, handleNavigateToHome
  ]);
};
