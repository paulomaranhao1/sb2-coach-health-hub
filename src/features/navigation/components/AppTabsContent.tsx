import React, { Suspense } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LoadingSection } from "@/components/ui/loading-states";
import TabNavigation from "@/components/layout/TabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import SupplementReminder from "@/components/SupplementReminder";
import AppSettings from "@/components/AppSettings";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";

// Lazy load heavy components for better performance
const LazyDailyHabit = React.lazy(() => import("@/components/DailyHabit"));
const LazyDashboardOverview = React.lazy(() => import("@/features/dashboard/components/DashboardOverview"));
const LazyAIChat = React.lazy(() => import("@/components/AIChat"));
const LazyCalorieCounterTab = React.lazy(() => import("@/features/calorie-counter/components/CalorieCounterTab"));
const LazyIntermittentFasting = React.lazy(() => import("@/features/fasting/components/IntermittentFasting"));
const LazyGamificationSystem = React.lazy(() => import("@/components/GamificationSystem"));
const LazyUserProfile = React.lazy(() => import("@/components/UserProfile"));

interface AppTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToHome: () => void;
}

const AppTabsContent = ({ activeTab, setActiveTab, onNavigateToHome }: AppTabsContentProps) => {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-full">
          <TabsContent value="home" className="w-full p-4 space-y-4 m-0">
            <MotivationalGreeting />
            <GlobalErrorBoundary level="component" name="Daily Habit">
              <Suspense fallback={<LoadingSection text="Carregando hábitos..." />}>
                <LazyDailyHabit />
              </Suspense>
            </GlobalErrorBoundary>
            <ComingSoonFeatures />
          </TabsContent>

          <TabsContent value="chat" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="AI Chat">
              <Suspense fallback={<LoadingSection text="Carregando chat..." />}>
                <LazyAIChat />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="calorie-counter" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Calorie Counter">
              <Suspense fallback={<LoadingSection text="Carregando contador..." />}>
                <LazyCalorieCounterTab />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="intermittent-fasting" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Intermittent Fasting">
              <Suspense fallback={<LoadingSection text="Carregando jejum..." />}>
                <LazyIntermittentFasting />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="gamification" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Gamification">
              <Suspense fallback={<LoadingSection text="Carregando gamificação..." />}>
                <LazyGamificationSystem />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="supplement" className="w-full p-4 m-0">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="statistics" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Dashboard Overview">
              <Suspense fallback={<LoadingSection text="Carregando estatísticas..." />}>
                <LazyDashboardOverview />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="profile" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="User Profile">
              <Suspense fallback={<LoadingSection text="Carregando perfil..." />}>
                <LazyUserProfile onNavigateToHome={onNavigateToHome} />
              </Suspense>
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="settings" className="w-full p-4 m-0">
            <AppSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AppTabsContent;