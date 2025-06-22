
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';
import { usePushNotifications } from './usePushNotifications';
import { calculateStreak } from '@/utils/streakUtils';

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
  permission: NotificationPermission;
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
  permission: 'default',
};

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  const { isSubscriptionLoading: subscriptionLoading, subscribe, unsubscribe } = usePushNotifications();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const checkUserProfile = async () => {
    console.log('useAppState: Verificando perfil do usuário...');
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('useAppState: Usuário não logado');
        setIsLoading(false);
        return;
      }

      console.log('useAppState: Usuário logado:', user.id);

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useAppState: Erro ao buscar perfil:', error);
        setIsLoading(false);
        return;
      }

      console.log('useAppState: Perfil encontrado:', !!profile);
      setUserProfile(profile);

      // Lógica para determinar qual tela mostrar
      if (!profile) {
        console.log('useAppState: Sem perfil - mostrando welcome');
        setShowWelcome(true);
      } else if (!profile.onboarding_completed) {
        console.log('useAppState: Onboarding não completo');
        setShowWelcome(false);
        setShowOnboarding(true);
      } else {
        console.log('useAppState: Perfil completo - indo para app principal');
        setShowWelcome(false);
        setShowOnboarding(false);
      }

    } catch (error) {
      console.error('useAppState: Erro ao verificar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = useCallback(async () => {
    if (!userProfile?.user_id) return;
    
    try {
      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userProfile.user_id)
        .single();

      if (error) {
        console.error("Erro ao buscar estatísticas do usuário:", error);
        return;
      }

      setUserStats(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
    }
  }, [userProfile?.user_id]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const updateStats = async (updates: Partial<UserStats>) => {
    if (!userProfile?.user_id || !userStats) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userProfile.user_id)
        .select('*')
        .single();

      if (error) {
        console.error("Erro ao atualizar estatísticas:", error);
        toast({
          title: "Erro ao atualizar estatísticas",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setUserStats(data);
      console.log("Estatísticas atualizadas com sucesso:", data);
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao salvar as estatísticas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const startNotificationSchedule = async () => {
    if (permission !== 'granted') {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);
      if (newPermission !== 'granted') {
        toast({
          title: "Permissão negada",
          description: "Você precisa permitir notificações para receber lembretes.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      await subscribe();
      toast({
        title: "Notificações ativadas!",
        description: "Você receberá lembretes diários para manter o foco.",
      });
    } catch (error: any) {
      console.error("Erro ao ativar notificações:", error);
      toast({
        title: "Erro ao ativar notificações",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('useAppState: Onboarding completo');
    setShowOnboarding(false);
    setShowTutorial(true);
    await checkUserProfile();
  };

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    setShowNewFeatures(true);
    
    // Atualizar user_stats para marcar tutorial_completed
    await updateStats({ tutorial_completed: true });
  };

  const handleTutorialSkip = async () => {
    setShowTutorial(false);
    setShowNewFeatures(true);
    
    // Atualizar user_stats para marcar tutorial_completed como false
    await updateStats({ tutorial_completed: false });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleNavigateToHome = () => {
    navigate('/');
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
    setUserProfile,
    userStats,
    setUserStats,
    isLoading,
    setIsLoading,
    theme,
    toggleTheme,
    permission,
    subscriptionLoading,
    subscribe,
    unsubscribe,
    startNotificationSchedule,
    checkUserProfile,
    fetchUserStats,
    updateStats,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome
  };
};
