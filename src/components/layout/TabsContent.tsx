
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ModernHomeScreen from "@/components/modern/ModernHomeScreen";
import SupplementReminder from "@/components/SupplementReminder";
import AIChat from "@/components/AIChat";
import ProgressDashboard from "@/components/ProgressDashboard";
import UserProfile from "@/components/UserProfile";
import AppSettings from "@/components/AppSettings";
import GamificationSystem from "@/components/GamificationSystem";
import IntermittentFasting from "@/components/IntermittentFasting";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import CalorieCounterTab from "@/components/CalorieCounterTab";
import NewFeaturesScreen from "@/components/NewFeaturesScreen";
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
      <TabsContent value="home" className="mt-0">
        <ModernHomeScreen />
      </TabsContent>

      <TabsContent value="chat" className="mt-0">
        <AIChat />
      </TabsContent>

      <TabsContent value="calorie-counter" className="mt-0">
        <CalorieCounterTab />
      </TabsContent>

      <TabsContent value="intermittent-fasting" className="mt-0">
        <IntermittentFasting />
      </TabsContent>

      <TabsContent value="gamification" className="mt-0">
        <GamificationSystem />
      </TabsContent>

      <TabsContent value="supplement" className="mt-0">
        <SupplementReminder />
      </TabsContent>

      <TabsContent value="roadmap" className="mt-0">
        <Roadmap />
      </TabsContent>

      <TabsContent value="statistics" className="mt-0">
        <StatisticsOverview userProfile={userProfile} userStats={userStats} />
      </TabsContent>

      <TabsContent value="profile" className="mt-0">
        <UserProfile onNavigateToHome={onNavigateToHome} />
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <AppSettings />
      </TabsContent>

      <TabsContent value="new-features" className="mt-0">
        <NewFeaturesScreen onBack={() => setActiveTab('home')} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContentComponent;
