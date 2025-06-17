import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WeightTracker from "@/components/WeightTracker";
import SupplementReminder from "@/components/SupplementReminder";
import AIChat from "@/components/AIChat";
import ProgressDashboard from "@/components/ProgressDashboard";
import UserProfile from "@/components/UserProfile";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import DailyHabit from "@/components/DailyHabit";
import GamificationSystem from "@/components/GamificationSystem";
import { Loading } from "@/components/ui/loading";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import TabNavigation from "@/components/layout/TabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserProfile(profile);
        
        if (!profile || !profile.onboarding_completed) {
          setShowOnboarding(true);
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
    toastFeedback.success('Onboarding concluído! Bem-vindo ao SB2FIT!');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowMobileMenu(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
        <Loading size="lg" text="Carregando SB2FIT..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 dark:from-gray-950 dark:via-gray-900 dark:to-red-950 transition-colors duration-300">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white border-red-400 dark:border-red-500 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peso Atual</CardTitle>
                  <CardDescription className="text-red-100 dark:text-red-200">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {userProfile?.weight ? `${userProfile.weight} kg` : '--'}
                  </div>
                  <p className="text-sm text-red-100 dark:text-red-200 mt-1">
                    {userProfile?.weight ? 'Registrado no perfil' : 'Adicione seu peso'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-800 dark:to-gray-700 text-white border-gray-500 dark:border-gray-600 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Meta</CardTitle>
                  <CardDescription className="text-gray-200 dark:text-gray-300">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.0 kg</div>
                  <p className="text-sm text-gray-200 dark:text-gray-300 mt-1">
                    {userProfile?.weight ? `Faltam ${(userProfile.weight - 68).toFixed(1)}kg` : 'Defina sua meta'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-700 to-red-800 dark:from-red-800 dark:to-red-900 text-white border-red-600 dark:border-red-700 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                  <CardDescription className="text-red-100 dark:text-red-200">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold animate-pulse">12 dias</div>
                  <p className="text-sm text-red-100 dark:text-red-200 mt-1">Usando SB2FIT</p>
                </CardContent>
              </Card>
            </div>
            <DailyHabit />
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
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
