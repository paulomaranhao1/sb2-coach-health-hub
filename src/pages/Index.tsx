
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
  const [userStats, setUserStats] = useState(null);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <Loading size="lg" text="Carregando SB2FIT..." />
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
            {/* Hábitos Diários - Prioridade no Topo */}
            <DailyHabit />
            
            {/* Cards de Status */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                    Peso Atual
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {userProfile?.weight ? `${userProfile.weight} kg` : '--'}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {userProfile?.weight ? 'Registrado no perfil' : 'Adicione seu peso'}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                    Meta
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {userProfile?.goal_weight ? `${userProfile.goal_weight} kg` : '--'}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {userProfile?.weight && userProfile?.goal_weight 
                      ? `Faltam ${(userProfile.weight - userProfile.goal_weight).toFixed(1)}kg` 
                      : 'Defina sua meta'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
                    Sequência
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
                    {userStats?.streak || 0} dias
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Usando SB2FIT</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Cards de Gamificação */}
            {userStats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      🏆 Nível
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.level}</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      ⭐ Pontos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.points}</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      🛡️ Escudos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.shields?.length || 0}</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      🎨 Figurinhas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.stickers?.length || 0}</div>
                  </CardContent>
                </Card>
              </div>
            )}
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
