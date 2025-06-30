
import { memo } from "react";
import { useProgressData } from "@/features/progress/hooks/useProgressData";
import { useLogger } from "@/utils/logger";
import StatisticsHeader from "./StatisticsHeader";
import QuickStats from "./QuickStats";
import ProgressOverview from "./ProgressOverview";
import StatusCards from "../home/StatusCards";
import GamificationCards from "../home/GamificationCards";
import ProgressDashboard from "../ProgressDashboard";
import GlobalErrorBoundary from "../error/GlobalErrorBoundary";
import StatsSkeleton from "../ui/skeletons/StatsSkeleton";

interface StatisticsOverviewProps {
  userProfile: any;
  userStats: any;
}

const StatisticsOverview = memo(({ userProfile, userStats }: StatisticsOverviewProps) => {
  const logger = useLogger('StatisticsOverview');
  const {
    loading,
    weightHistory,
    shareProgress
  } = useProgressData();

  logger.debug('Rendered', { 
    hasProfile: !!userProfile, 
    hasStats: !!userStats,
    loading 
  });

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
    <GlobalErrorBoundary level="section" name="Statistics Overview">
      <div className="space-y-6">
        <GlobalErrorBoundary level="component" name="Statistics Header">
          <StatisticsHeader onShare={shareProgress} />
        </GlobalErrorBoundary>
        
        <GlobalErrorBoundary level="component" name="Quick Stats">
          <QuickStats 
            userProfile={userProfile} 
            userStats={userStats} 
            weightHistory={weightHistory}
          />
        </GlobalErrorBoundary>
        
        <GlobalErrorBoundary level="component" name="Progress Overview">
          <ProgressOverview userProfile={userProfile} userStats={userStats} />
        </GlobalErrorBoundary>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <GlobalErrorBoundary level="component" name="Status Cards">
              <StatusCards userProfile={userProfile} userStats={userStats} />
            </GlobalErrorBoundary>
          </div>
          <div className="space-y-6">
            <GlobalErrorBoundary level="component" name="Gamification Cards">
              <GamificationCards />
            </GlobalErrorBoundary>
          </div>
        </div>
        
        <GlobalErrorBoundary level="component" name="Progress Dashboard">
          <ProgressDashboard />
        </GlobalErrorBoundary>
      </div>
    </GlobalErrorBoundary>
  );
});

StatisticsOverview.displayName = 'StatisticsOverview';

export default StatisticsOverview;
