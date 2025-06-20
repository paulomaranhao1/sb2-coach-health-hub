
import { useProgressData } from "@/hooks/useProgressData";
import ProgressHeader from "./progress/ProgressHeader";
import GoalProgressCard from "./progress/GoalProgressCard";
import UserStatsCards from "./progress/UserStatsCards";
import WeightEvolutionChart from "./progress/WeightEvolutionChart";
import WeeklyAdherenceChart from "./progress/WeeklyAdherenceChart";
import SecondaryCharts from "./progress/SecondaryCharts";
import DetailedStatsCards from "./progress/DetailedStatsCards";
import WeightStatistics from "./progress/WeightStatistics";

const ProgressDashboard = () => {
  const {
    weightHistory,
    userStats,
    loading,
    shareProgress,
    currentWeightValue,
    initialWeight,
    weightLoss,
    avgWeightLossPerWeek,
    bestWeekLoss,
    consistencyScore
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
      <ProgressHeader hasData={weightHistory.length > 0} onShare={shareProgress} />
      
      <GoalProgressCard />
      
      <UserStatsCards 
        userStats={userStats}
        weightHistoryLength={weightHistory.length}
        consistencyScore={consistencyScore}
        avgWeightLossPerWeek={avgWeightLossPerWeek}
      />
      
      <WeightEvolutionChart weightHistory={weightHistory} />
      
      <WeeklyAdherenceChart />
      
      <SecondaryCharts weightHistory={weightHistory} />
      
      <DetailedStatsCards />
      
      <WeightStatistics
        weightHistory={weightHistory}
        userStats={userStats}
        initialWeight={initialWeight}
        currentWeightValue={currentWeightValue}
        weightLoss={weightLoss}
        avgWeightLossPerWeek={avgWeightLossPerWeek}
        bestWeekLoss={bestWeekLoss}
        consistencyScore={consistencyScore}
        onShare={shareProgress}
      />
    </div>
  );
};

export default ProgressDashboard;
