
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
    <div className="w-full min-h-screen bg-slate-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-full">
          <TabsContent value="home" className="w-full p-4 space-y-4">
            <MotivationalGreeting />
            <DailyHabit />
            <ComingSoonFeatures />
          </TabsContent>

          <TabsContent value="chat" className="w-full p-4">
            <AIChat />
          </TabsContent>

          <TabsContent value="calorie-counter" className="w-full p-4">
            <CalorieCounterTab />
          </TabsContent>

          <TabsContent value="intermittent-fasting" className="w-full p-4">
            <IntermittentFasting />
          </TabsContent>

          <TabsContent value="gamification" className="w-full p-4">
            <GamificationSystem />
          </TabsContent>

          <TabsContent value="supplement" className="w-full p-4">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="statistics" className="w-full p-4">
            <StatisticsOverview userProfile={userProfile} userStats={userStats} />
          </TabsContent>

          <TabsContent value="profile" className="w-full p-4">
            <UserProfile onNavigateToHome={onNavigateToHome} />
          </TabsContent>

          <TabsContent value="settings" className="w-full p-4">
            <AppSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TabsContentComponent;
