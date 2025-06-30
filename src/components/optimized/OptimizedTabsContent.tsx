
import React, { memo, Suspense } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabNavigation from "@/components/layout/TabNavigation";
import { LoadingSection } from "@/components/ui/loading-states";
import ErrorBoundary from "@/components/error/ErrorBoundary";

// Lazy load heavy components
const LazyDailyHabit = React.lazy(() => import("@/components/DailyHabit"));
const LazyStatisticsOverview = React.lazy(() => import("@/components/statistics/StatisticsOverview"));
const LazyAIChat = React.lazy(() => import("@/components/AIChat"));
const LazyCalorieCounterTab = React.lazy(() => import("@/components/CalorieCounterTab"));
const LazyIntermittentFasting = React.lazy(() => import("@/components/IntermittentFasting"));
const LazyGamificationSystem = React.lazy(() => import("@/components/GamificationSystem"));
const LazyUserProfile = React.lazy(() => import("@/components/UserProfile"));
const LazyAppSettings = React.lazy(() => import("@/components/AppSettings"));

// Lightweight components (not lazy loaded)
import MotivationalGreeting from "@/components/MotivationalGreeting";
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import SupplementReminder from "@/components/SupplementReminder";
import NewFeaturesScreen from "@/components/NewFeaturesScreen";
import Roadmap from "../../pages/Roadmap";

interface OptimizedTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: any;
  userStats: any;
  onNavigateToHome: () => void;
}

const OptimizedTabsContent = memo(({
  activeTab,
  setActiveTab,
  userProfile,
  userStats,
  onNavigateToHome
}: OptimizedTabsContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabsContent value="home" className="space-y-6">
        <MotivationalGreeting />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando rotina diária..." />}>
            <LazyDailyHabit />
          </Suspense>
        </ErrorBoundary>
        <ComingSoonFeatures />
      </TabsContent>

      <TabsContent value="chat">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando chat AI..." />}>
            <LazyAIChat />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="calorie-counter" className="space-y-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando contador de calorias..." />}>
            <LazyCalorieCounterTab />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="intermittent-fasting" className="space-y-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando jejum intermitente..." />}>
            <LazyIntermittentFasting />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="gamification">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando gamificação..." />}>
            <LazyGamificationSystem />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="supplement">
        <SupplementReminder />
      </TabsContent>

      <TabsContent value="roadmap">
        <Roadmap />
      </TabsContent>

      <TabsContent value="statistics" className="space-y-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando estatísticas..." />}>
            <LazyStatisticsOverview userProfile={userProfile} userStats={userStats} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="profile">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando perfil..." />}>
            <LazyUserProfile onNavigateToHome={onNavigateToHome} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="settings">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSection text="Carregando configurações..." />}>
            <LazyAppSettings />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="new-features">
        <NewFeaturesScreen onBack={() => setActiveTab('home')} />
      </TabsContent>
    </Tabs>
  );
});

OptimizedTabsContent.displayName = 'OptimizedTabsContent';

export default OptimizedTabsContent;
