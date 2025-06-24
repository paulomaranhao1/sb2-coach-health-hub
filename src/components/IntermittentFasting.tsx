
import { useState } from "react";
import { useFasting } from "@/hooks/useFasting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedFastingTimer from "./fasting/AdvancedFastingTimer";
import FastingAnalytics from "./fasting/FastingAnalytics";
import FastingGoals from "./fasting/FastingGoals";
import FastingHeader from "./fasting/FastingHeader";
import FastingOverviewTab from "./fasting/FastingOverviewTab";
import FastingEducationTab from "./fasting/FastingEducationTab";
import FastingPlanCard from "./fasting/FastingPlanCard";

interface FastingGoal {
  weekly: number;
  monthly: number;
  currentWeek: number;
  currentMonth: number;
}

const IntermittentFasting = () => {
  const [selectedPlan, setSelectedPlan] = useState("16:8");
  const [fastingGoals, setFastingGoals] = useState<FastingGoal>({
    weekly: 5,
    monthly: 20,
    currentWeek: 3,
    currentMonth: 12
  });

  const {
    currentFast,
    timeRemaining,
    isActive,
    isPaused,
    startFast,
    stopFast,
    calculateProgress,
    formatTime,
    getFastingPhase,
    getStats
  } = useFasting();

  const stats = getStats();

  return (
    <div className="space-y-6">
      <FastingHeader 
        title="⏰ Jejum Intermitente Avançado"
        description="Transforme sua saúde com o poder do jejum intermitente científico"
      />

      {currentFast ? (
        <AdvancedFastingTimer 
          currentFast={currentFast}
          timeRemaining={timeRemaining}
          isActive={isActive}
          isPaused={isPaused}
          onPause={() => {}} // Função vazia já que não usamos mais pausar
          onStop={stopFast}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          getFastingPhase={getFastingPhase}
        />
      ) : (
        <FastingPlanCard
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          onStartFast={startFast}
        />
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="education">Educação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <FastingOverviewTab stats={stats} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FastingAnalytics stats={stats} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <FastingGoals fastingGoals={fastingGoals} />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <FastingEducationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntermittentFasting;
