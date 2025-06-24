
import { memo } from "react";
import { useProgressData } from "@/features/progress/hooks/useProgressData";
import StatisticsHeader from "./StatisticsHeader";
import QuickStats from "./QuickStats";
import ProgressOverview from "./ProgressOverview";
import StatusCards from "../home/StatusCards";
import GamificationCards from "../home/GamificationCards";
import ProgressDashboard from "../ProgressDashboard";

interface StatisticsOverviewProps {
  userProfile: any;
  userStats: any;
}

const StatisticsOverview = memo(({ userProfile, userStats }: StatisticsOverviewProps) => {
  const {
    loading,
    weightHistory,
    shareProgress
  } = useProgressData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatisticsHeader onShare={shareProgress} />
      
      <QuickStats 
        userProfile={userProfile} 
        userStats={userStats} 
        weightHistory={weightHistory}
      />
      
      <ProgressOverview userProfile={userProfile} userStats={userStats} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <StatusCards userProfile={userProfile} userStats={userStats} />
        </div>
        <div className="space-y-6">
          <GamificationCards userStats={userStats} />
        </div>
      </div>
      
      <ProgressDashboard />
    </div>
  );
});

StatisticsOverview.displayName = 'StatisticsOverview';

export default StatisticsOverview;
