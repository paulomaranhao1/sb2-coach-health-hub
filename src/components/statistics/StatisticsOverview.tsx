
import { memo } from "react";
import { useProgressData } from "@/features/progress/hooks/useProgressData";
import StatisticsHeader from "./StatisticsHeader";
import QuickStats from "./QuickStats";
import ProgressOverview from "./ProgressOverview";
import StatusCards from "../home/StatusCards";
import GamificationCards from "../home/GamificationCards";
import ProgressDashboard from "../ProgressDashboard";
import ErrorBoundary from "../error/ErrorBoundary";
import StatsSkeleton from "../ui/skeletons/StatsSkeleton";

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
      <div className="space-y-6">
        <StatsSkeleton />
        <StatsSkeleton />
        <div className="grid gap-6 lg:grid-cols-2">
          <StatsSkeleton />
          <StatsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <StatisticsHeader onShare={shareProgress} />
        
        <ErrorBoundary>
          <QuickStats 
            userProfile={userProfile} 
            userStats={userStats} 
            weightHistory={weightHistory}
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <ProgressOverview userProfile={userProfile} userStats={userStats} />
        </ErrorBoundary>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ErrorBoundary>
              <StatusCards userProfile={userProfile} userStats={userStats} />
            </ErrorBoundary>
          </div>
          <div className="space-y-6">
            <ErrorBoundary>
              <GamificationCards userStats={userStats} />
            </ErrorBoundary>
          </div>
        </div>
        
        <ErrorBoundary>
          <ProgressDashboard />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

StatisticsOverview.displayName = 'StatisticsOverview';

export default StatisticsOverview;
