import { memo } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useLogger } from "@/utils/logger";
import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import QuickStats from "@/components/statistics/QuickStats";
import ProgressOverview from "@/components/statistics/ProgressOverview";
import StatusCards from "@/components/home/StatusCards";
import GamificationCards from "@/components/home/GamificationCards";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import StatsSkeleton from "@/components/ui/skeletons/StatsSkeleton";
import WeightEvolutionChart from "@/components/progress/WeightEvolutionChart";
import WeeklyAdherenceChart from "@/components/progress/WeeklyAdherenceChart";

const DashboardOverview = memo(() => {
  const logger = useLogger('DashboardOverview');
  const { userProfile, userStats, weightHistory, loading, shareProgress } = useDashboardData();

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
    <GlobalErrorBoundary level="section" name="Dashboard Overview">
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

        <GlobalErrorBoundary level="component" name="Weight Evolution Chart">
          <WeightEvolutionChart weightHistory={weightHistory} />
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

        <GlobalErrorBoundary level="component" name="Weekly Adherence Chart">
          <WeeklyAdherenceChart />
        </GlobalErrorBoundary>
      </div>
    </GlobalErrorBoundary>
  );
});

DashboardOverview.displayName = 'DashboardOverview';

export default DashboardOverview;