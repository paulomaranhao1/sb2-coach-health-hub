
import React, { memo, useState, useCallback, Suspense, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LoadingSection } from "@/components/ui/loading-states";
import OptimizedTabNavigation from "@/components/layout/OptimizedTabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import SupplementReminder from "@/components/SupplementReminder";
import AppSettings from "@/components/AppSettings";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import { useNavigationCache } from "@/hooks/useNavigationCache";
import { useLogger } from '@/utils/logger';

// Lazy load apenas os essenciais
const LazyDailyHabit = React.lazy(() => import("@/components/DailyHabit"));
const LazyDashboardOverview = React.lazy(() => import("@/features/dashboard/components/DashboardOverview"));

interface OptimizedAppTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToHome: () => void;
}

const OptimizedAppTabsContent = memo(({ activeTab, setActiveTab, onNavigateToHome }: OptimizedAppTabsContentProps) => {
  const logger = useLogger('OptimizedAppTabsContent');
  const { getCachedComponent, preloadComponent } = useNavigationCache();
  const [loadedComponents, setLoadedComponents] = useState<Record<string, React.ComponentType<any>>>({});

  // Preload inteligente baseado no tab ativo
  useEffect(() => {
    const preloadNext = async () => {
      if (activeTab === 'home') {
        // Preload próximos prováveis: chat, calorie-counter
        preloadComponent('chat');
        preloadComponent('calorie-counter');
      } else if (activeTab === 'calorie-counter') {
        preloadComponent('statistics');
      } else if (activeTab === 'chat') {
        preloadComponent('profile');
      }
    };

    preloadNext();
  }, [activeTab, preloadComponent]);

  const loadComponent = useCallback(async (componentName: string) => {
    if (loadedComponents[componentName]) return loadedComponents[componentName];
    
    let Component = getCachedComponent(componentName);
    
    if (!Component) {
      try {
        let module;
        switch (componentName) {
          case 'chat':
            module = await import('@/components/AIChat');
            break;
          case 'calorie-counter':
            module = await import('@/features/calorie-counter/components/CalorieCounterTab');
            break;
          case 'intermittent-fasting':
            module = await import('@/features/fasting/components/IntermittentFasting');
            break;
          case 'gamification':
            module = await import('@/components/GamificationSystem');
            break;
          case 'profile':
            module = await import('@/components/UserProfile');
            break;
          default:
            return null;
        }
        
        Component = module.default;
        setLoadedComponents(prev => ({ ...prev, [componentName]: Component }));
      } catch (error) {
        logger.error(`Failed to load component ${componentName}`, { error });
        return null;
      }
    }
    
    return Component;
  }, [loadedComponents, getCachedComponent, logger]);

  const LazyComponentRenderer = memo(({ componentName, fallback, ...props }: any) => {
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(
      () => getCachedComponent(componentName) || loadedComponents[componentName] || null
    );

    useEffect(() => {
      if (!Component) {
        loadComponent(componentName).then(setComponent);
      }
    }, [Component, componentName]);

    if (!Component) {
      return fallback || <LoadingSection text="Carregando..." />;
    }

    return <Component {...props} />;
  });

  const handleTabChange = useCallback((tab: string) => {
    // Preload do componente imediatamente ao trocar tab
    if (tab !== 'home' && tab !== 'supplement' && tab !== 'settings') {
      loadComponent(tab);
    }
    setActiveTab(tab);
  }, [setActiveTab, loadComponent]);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <OptimizedTabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

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
              <LazyComponentRenderer
                componentName="chat"
                fallback={<LoadingSection text="Carregando chat..." />}
              />
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="calorie-counter" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Calorie Counter">
              <LazyComponentRenderer
                componentName="calorie-counter"
                fallback={<LoadingSection text="Carregando contador..." />}
              />
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="intermittent-fasting" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Intermittent Fasting">
              <LazyComponentRenderer
                componentName="intermittent-fasting"
                fallback={<LoadingSection text="Carregando jejum..." />}
              />
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="gamification" className="w-full p-4 m-0">
            <GlobalErrorBoundary level="component" name="Gamification">
              <LazyComponentRenderer
                componentName="gamification"
                fallback={<LoadingSection text="Carregando gamificação..." />}
              />
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
              <LazyComponentRenderer
                componentName="profile"
                fallback={<LoadingSection text="Carregando perfil..." />}
                onNavigateToHome={onNavigateToHome}
              />
            </GlobalErrorBoundary>
          </TabsContent>

          <TabsContent value="settings" className="w-full p-4 m-0">
            <AppSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});

OptimizedAppTabsContent.displayName = 'OptimizedAppTabsContent';

export default OptimizedAppTabsContent;
