
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
    isLoading
  } = useHomeData(userProfile?.user_id);

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

  if (isLoading) {
    return <LoadingSection text="Carregando dados..." />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeContent
            userProfile={userProfile}
            userStats={userStats}
            weightEntries={weightEntries}
            lastFastingSession={lastFastingSession}
            recentFoodAnalysis={recentFoodAnalysis}
            onAddWeight={handleAddWeight}
            onStartFasting={handleStartFasting}
            onAnalyzeFood={handleAnalyzeFood}
            onViewProgress={handleViewProgress}
          />
        );
      
      case 'progress':
        return (
          <ProgressDashboard />
        );
      
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
        return (
          <HomeContent
            userProfile={userProfile}
            userStats={userStats}
            weightEntries={weightEntries}
            lastFastingSession={lastFastingSession}
            recentFoodAnalysis={recentFoodAnalysis}
            onAddWeight={handleAddWeight}
            onStartFasting={handleStartFasting}
            onAnalyzeFood={handleAnalyzeFood}
            onViewProgress={handleViewProgress}
          />
        );
    }
  };

  return (
    <GlobalErrorBoundary 
      level="section" 
      name={`Tab Content - ${activeTab}`}
      showDebugInfo={false}
    >
      <div className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </GlobalErrorBoundary>
  );
});

TabsContentComponent.displayName = 'TabsContentComponent';

export default TabsContentComponent;
