
import { memo } from "react";
import { useProgressData } from "@/features/progress/hooks/useProgressData";
import StatisticsHeader from "./StatisticsHeader";
import QuickStats from "./QuickStats";
import ProgressOverview from "./ProgressOverview";
import StatusCards from "../home/StatusCards";
import GamificationCards from "../home/GamificationCards";
import ProgressDashboard from "../ProgressDashboard";
import SectionErrorBoundary from "../error/SectionErrorBoundary";
import StatsSkeleton from "../ui/skeletons/StatsSkeleton";
import { logger } from "@/utils/logger";

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

  logger.debug('StatisticsOverview rendered', { 
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
    <SectionErrorBoundary sectionName="Estatísticas">
      <div className="space-y-6">
        <SectionErrorBoundary sectionName="Cabeçalho de Estatísticas">
          <StatisticsHeader onShare={shareProgress} />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Estatísticas Rápidas">
          <QuickStats 
            userProfile={userProfile} 
            userStats={userStats} 
            weightHistory={weightHistory}
          />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Visão Geral do Progresso">
          <ProgressOverview userProfile={userProfile} userStats={userStats} />
        </SectionErrorBoundary>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionErrorBoundary sectionName="Cartões de Status">
              <StatusCards userProfile={userProfile} userStats={userStats} />
            </SectionErrorBoundary>
          </div>
          <div className="space-y-6">
            <SectionErrorBoundary sectionName="Cartões de Gamificação">
              <GamificationCards userStats={userStats} />
            </SectionErrorBoundary>
          </div>
        </div>
        
        <SectionErrorBoundary sectionName="Dashboard de Progresso">
          <ProgressDashboard />
        </SectionErrorBoundary>
      </div>
    </SectionErrorBoundary>
  );
});

StatisticsOverview.displayName = 'StatisticsOverview';

export default StatisticsOverview;
