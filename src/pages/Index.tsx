
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
import IntermittentFasting from "@/components/IntermittentFasting";
import { Loading } from "@/components/ui/loading";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/hooks/useNotifications";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import TabNavigation from "@/components/layout/TabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import { Camera, Clock, BarChart3 } from "lucide-react";
import CalorieCounterTab from "@/components/CalorieCounterTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import RoadmapSection from "@/components/RoadmapSection";

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
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscription();

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

  const handlePurchase = () => {
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
    toastFeedback.info('Redirecionando para a loja...');
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

  if (isLoading || subscriptionLoading) {
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
            <RoadmapSection />
            <ComingSoonFeatures />
          </TabsContent>

          <TabsContent value="chat">
            <AIChat />
          </TabsContent>

          <TabsContent value="calorie-counter" className="space-y-6">
            <CalorieCounterTab />
          </TabsContent>

          <TabsContent value="intermittent-fasting" className="space-y-6">
            {hasPremiumAccess ? (
              <IntermittentFasting />
            ) : (
              <div className="space-y-6">
                {/* Preview do conteúdo com blur */}
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none">
                    <IntermittentFasting />
                  </div>
                  
                  {/* Overlay de pagamento */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <Card className="max-w-md mx-auto border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                      <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <Crown className="w-12 h-12 text-yellow-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          🔒 Funcionalidade Premium
                        </CardTitle>
                        <CardDescription className="text-lg">
                          O Jejum Intermitente é uma funcionalidade exclusiva do SB2 Turbo
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 text-center">
                        <div className="space-y-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            ⏰ Timer inteligente de jejum
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            📊 Múltiplos planos de jejum (16:8, 18:6, 20:4, OMAD)
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            🏆 Sistema de conquistas e estatísticas
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            💡 Dicas científicas e orientações
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t border-yellow-200">
                          <Button
                            onClick={handlePurchase}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            <Crown className="w-5 h-5 mr-2" />
                            Desbloquear SB2 Turbo
                          </Button>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Acesso completo a todas as funcionalidades premium
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationSystem />
          </TabsContent>

          <TabsContent value="supplement">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatisticsOverview userProfile={userProfile} userStats={userStats} />
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
