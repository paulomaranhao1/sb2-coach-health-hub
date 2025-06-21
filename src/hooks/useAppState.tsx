
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toastFeedback } from '@/components/ui/toast-feedback';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { useSubscription } from '@/hooks/useSubscription';

export const useAppState = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNewFeatures, setShowNewFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { theme, toggleTheme } = useTheme();
  const { permission, startNotificationSchedule } = useNotifications();
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscription();

  const checkUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Buscar perfil do usuário
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserProfile(profile);
        
        // Buscar estatísticas do usuário
        const { data: stats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserStats(stats);
        
        if (!profile || !profile.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          // Verificar se o usuário já viu o tutorial
          const hasSeenTutorial = localStorage.getItem('sb2_tutorial_completed');
          if (!hasSeenTutorial) {
            setShowTutorial(true);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar perfil do usuário:', error);
      toastFeedback.error('Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    checkUserProfile();
    // Mostrar tutorial após onboarding
    setShowTutorial(true);
    toastFeedback.success('Onboarding concluído! Bem-vindo ao SB2coach.ai!');
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('sb2_tutorial_completed', 'true');
    toastFeedback.success('Tutorial concluído! Agora você está pronto para começar sua jornada!');
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    localStorage.setItem('sb2_tutorial_completed', 'true');
    toastFeedback.info('Tutorial pulado. Você pode acessar a ajuda no seu perfil a qualquer momento.');
  };

  const handleTabChange = (value: string) => {
    if (value === 'new-features') {
      setShowNewFeatures(true);
      setShowMobileMenu(false);
      return;
    }
    
    setActiveTab(value);
    setShowMobileMenu(false);
  };

  const handleNavigateToHome = () => {
    setActiveTab('home');
  };

  return {
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
    userStats,
    isLoading,
    theme,
    toggleTheme,
    permission,
    startNotificationSchedule,
    hasPremiumAccess,
    subscriptionLoading,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome
  };
};
