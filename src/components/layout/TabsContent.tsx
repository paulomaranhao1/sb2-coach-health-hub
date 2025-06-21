
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WeightTracker from "@/components/WeightTracker";
import SupplementReminder from "@/components/SupplementReminder";
import AIChat from "@/components/AIChat";
import ProgressDashboard from "@/components/ProgressDashboard";
import UserProfile from "@/components/UserProfile";
import AppSettings from "@/components/AppSettings";
import DailyHabit from "@/components/DailyHabit";
import GamificationSystem from "@/components/GamificationSystem";
import IntermittentFasting from "@/components/IntermittentFasting";
import TabNavigation from "@/components/layout/TabNavigation";
import MotivationalGreeting from "@/components/MotivationalGreeting";
import ComingSoonFeatures from "@/components/ComingSoonFeatures";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import CalorieCounterTab from "@/components/CalorieCounterTab";
import Roadmap from "../../pages/Roadmap";

interface TabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: any;
  userStats: any;
  onNavigateToHome: () => void;
}

const TabsContentComponent = ({
  activeTab,
  setActiveTab,
  userProfile,
  userStats,
  onNavigateToHome
}: TabsContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabsContent value="home" className="space-y-6">
        <MotivationalGreeting />
        <DailyHabit />
        <ComingSoonFeatures />
      </TabsContent>

      <TabsContent value="chat">
        <AIChat />
      </TabsContent>

      <TabsContent value="calorie-counter" className="space-y-6">
        <CalorieCounterTab />
      </TabsContent>

      <TabsContent value="intermittent-fasting" className="space-y-6">
        <IntermittentFasting />
      </TabsContent>

      <TabsContent value="gamification">
        <GamificationSystem />
      </TabsContent>

      <TabsContent value="supplement">
        <SupplementReminder />
      </TabsContent>

      <TabsContent value="roadmap">
        <Roadmap />
      </TabsContent>

      <TabsContent value="statistics" className="space-y-6">
        <StatisticsOverview userProfile={userProfile} userStats={userStats} />
      </TabsContent>

      <TabsContent value="profile">
        <UserProfile onNavigateToHome={onNavigateToHome} />
      </TabsContent>

      <TabsContent value="settings">
        <AppSettings />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContentComponent;
