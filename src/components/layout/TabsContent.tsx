
import { memo } from "react";
import { useHomeData } from "@/hooks/useHomeData";
import { LoadingSection } from "@/components/ui/loading-states";
import HomeContent from "@/components/home/HomeContent";
import ProgressDashboard from "@/components/ProgressDashboard";
import CalorieCounterTab from "@/components/CalorieCounterTab";
import IntermittentFasting from "@/components/IntermittentFasting";
import DailyHabit from "@/components/daily-habit/DailyHabit";
import UserProfile from "@/components/UserProfile";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import HomeOnlyLayout from "./HomeOnlyLayout";

interface TabsContentComponentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: any;
  userStats: any;
  onNavigateToHome: () => void;
}

const TabsContentComponent = memo(({
  activeTab,
  setActiveTab,
  userProfile,
  userStats,
  onNavigateToHome
}: TabsContentComponentProps) => {
  const {
    weightEntries,
    lastFastingSession,
    recentFoodAnalysis,
    isLoading,
    error
  } = useHomeData(userProfile?.user_id);

  if (error) {
    console.error('Error loading home data:', error);
  }

  const handleAddWeight = () => {
    setActiveTab('habit');
  };

  const handleStartFasting = () => {
    setActiveTab('fasting');
  };

  const handleAnalyzeFood = () => {
    setActiveTab('calorie');
  };

  const handleViewProgress = () => {
    setActiveTab('progress');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        if (isLoading) {
          return <LoadingSection text="Carregando dados..." />;
        }
        return (
          <HomeContent
            userProfile={userProfile}
            userStats={userStats}
            weightEntries={weightEntries}
            lastFastingSession={lastFastingSession}
            recentFoodAnalysis={recentFoodAnalysis}
            onAddWeight={() => setActiveTab('habit')}
            onStartFasting={() => setActiveTab('fasting')}
            onAnalyzeFood={() => setActiveTab('calorie')}
            onViewProgress={() => setActiveTab('progress')}
          />
        );
      
      case 'progress':
        return <ProgressDashboard />;
      
      case 'calorie':
        return <CalorieCounterTab />;
      
      case 'fasting':
        return <IntermittentFasting />;
      
      case 'habit':
        return <DailyHabit />;
      
      case 'profile':
        return (
          <UserProfile 
            onNavigateToHome={onNavigateToHome}
          />
        );
      
      default:
        if (isLoading) {
          return <LoadingSection text="Carregando dados..." />;
        }
        return (
          <HomeContent
            userProfile={userProfile}
            userStats={userStats}
            weightEntries={weightEntries}
            lastFastingSession={lastFastingSession}
            recentFoodAnalysis={recentFoodAnalysis}
            onAddWeight={() => setActiveTab('habit')}
            onStartFasting={() => setActiveTab('fasting')}
            onAnalyzeFood={() => setActiveTab('calorie')}
            onViewProgress={() => setActiveTab('progress')}
          />
        );
    }
  };

  const content = (
    <GlobalErrorBoundary 
      level="section" 
      name={`Tab Content - ${activeTab}`}
      showDebugInfo={false}
    >
      {renderTabContent()}
    </GlobalErrorBoundary>
  );

  // Use layout limpo apenas para a home
  if (activeTab === 'home') {
    return <HomeOnlyLayout>{content}</HomeOnlyLayout>;
  }

  // Layout normal para outras abas
  return (
    <div className="container mx-auto px-4 py-6">
      {content}
    </div>
  );
});

TabsContentComponent.displayName = 'TabsContentComponent';

export default TabsContentComponent;
