
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
import { Eye, BarChart3, Target, BookOpen } from "lucide-react";

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
        <TabsList className="flex flex-col h-auto w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl p-4 shadow-xl space-y-3">
          <TabsTrigger 
            value="overview" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <Eye className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Visão Geral</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="analytics" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <BarChart3 className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Analytics</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="goals" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <Target className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Metas</span>
          </TabsTrigger>

          <TabsTrigger 
            value="education" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-orange-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <BookOpen className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Educação</span>
          </TabsTrigger>
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
