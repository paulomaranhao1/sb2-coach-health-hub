import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WeightTracker from "@/components/WeightTracker";
import SupplementReminder from "@/components/SupplementReminder";
import AIChat from "@/components/AIChat";
import ProgressDashboard from "@/components/ProgressDashboard";
import UserProfile from "@/components/UserProfile";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import TutorialScreen from "@/components/TutorialScreen";
import DailyHabit from "@/components/DailyHabit";
import GamificationSystem from "@/components/GamificationSystem";
import { Loading } from "@/components/ui/loading";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import TabNavigation from "@/components/layout/TabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";
import StatusCards from "@/components/home/StatusCards";
import GamificationCards from "@/components/home/GamificationCards";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { permission, startNotificationSchedule } = useNotifications();

  useEffect(() => {
    checkUserProfile();
  }, []);

  // Iniciar notificações quando o usuário concluir o onboarding
  useEffect(() => {
    if (userProfile?.onboarding_completed && permission === 'granted') {
      startNotificationSchedule();
    }
  }, [userProfile, permission, startNotificationSchedule]);

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
    toastFeedback.success('Onboarding concluído! Bem-vindo ao SB2 Coach!');
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
    setActiveTab(value);
    setShowMobileMenu(false);
  };

  const handleNavigateToHome = () => {
    setActiveTab('home');
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showTutorial) {
    return (
      <TutorialScreen 
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <Loading size="lg" text="Carregando SB2 Coach..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-500">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <MobileMenu 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <MotivationalGreeting />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <TabsContent value="home" className="space-y-6">
            <DailyHabit />
            <StatusCards userProfile={userProfile} userStats={userStats} />
            <GamificationCards userStats={userStats} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="weight">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="supplement">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="chat">
            <AIChat />
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationSystem />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile onNavigateToHome={handleNavigateToHome} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
