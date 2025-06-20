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
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import { Camera, Clock, BarChart3 } from "lucide-react";

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
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loading size="lg" text="Carregando SB2 Coach..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
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
            <ComingSoonFeatures />
          </TabsContent>

          <TabsContent value="chat">
            <AIChat />
          </TabsContent>

          <TabsContent value="calorie-counter" className="space-y-6">
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Contador de Calorias por Foto
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Em breve! Tire uma foto da sua refeição e descubra as calorias instantaneamente.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="intermittent-fasting" className="space-y-6">
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Jejum Intermitente
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Em breve! Acompanhe seus períodos de jejum e alimentação de forma inteligente.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationSystem />
          </TabsContent>

          <TabsContent value="supplement">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatusCards userProfile={userProfile} userStats={userStats} />
            <GamificationCards userStats={userStats} />
            <ProgressDashboard />
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
