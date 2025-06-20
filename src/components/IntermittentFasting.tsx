
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useFasting } from "@/hooks/useFasting";
import AdvancedFastingTimer from "./fasting/AdvancedFastingTimer";
import FastingPlanSelector from "./fasting/FastingPlanSelector";
import FastingAnalytics from "./fasting/FastingAnalytics";
import FastingGoals from "./fasting/FastingGoals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    pauseFast,
    stopFast,
    calculateProgress,
    formatTime,
    getFastingPhase,
    getStats
  } = useFasting();

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ⏰ Jejum Intermitente Avançado
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transforme sua saúde com o poder do jejum intermitente científico
        </p>
      </div>

      {/* Main Timer or Plan Selection */}
      {currentFast ? (
        <AdvancedFastingTimer 
          currentFast={currentFast}
          timeRemaining={timeRemaining}
          isActive={isActive}
          isPaused={isPaused}
          onPause={pauseFast}
          onStop={stopFast}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          getFastingPhase={getFastingPhase}
        />
      ) : (
        <Card className="border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-700 dark:text-gray-200">
              <Timer className="w-8 h-8" />
              Escolha Seu Plano de Jejum
            </CardTitle>
            <CardDescription className="text-lg">
              Selecione o plano ideal para seu nível e objetivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FastingPlanSelector 
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              onStartFast={startFast}
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="education">Educação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
                <div className="text-sm text-blue-500">Streak Atual</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedSessions}</div>
                <div className="text-sm text-green-500">Jejuns Completos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalHoursFasted.toFixed(0)}h</div>
                <div className="text-sm text-purple-500">Horas Totais</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.averageCompletion.toFixed(0)}%</div>
                <div className="text-sm text-orange-500">Taxa Sucesso</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FastingAnalytics stats={stats} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <FastingGoals fastingGoals={fastingGoals} />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                🧬 Ciência do Jejum Intermitente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-blue-600">Fases do Jejum</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium text-sm">0-4h: Digestão</p>
                        <p className="text-xs text-gray-600">Absorção de nutrientes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div>
                        <p className="font-medium text-sm">4-12h: Glicogênio</p>
                        <p className="text-xs text-gray-600">Uso das reservas de açúcar</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div>
                        <p className="font-medium text-sm">12-18h: Cetose</p>
                        <p className="text-xs text-gray-600">Queima de gordura intensificada</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="font-medium text-sm">18+h: Autofagia</p>
                        <p className="text-xs text-gray-600">Limpeza e regeneração celular</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-green-600">Benefícios Comprovados</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-medium text-sm">🔥 Perda de Peso</p>
                      <p className="text-xs text-gray-600">Acelera metabolismo em até 14%</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-sm">🧠 Saúde Cerebral</p>
                      <p className="text-xs text-gray-600">Aumenta BDNF em até 400%</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="font-medium text-sm">❤️ Saúde Cardíaca</p>
                      <p className="text-xs text-gray-600">Reduz pressão e colesterol</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-medium text-sm">⚡ Longevidade</p>
                      <p className="text-xs text-gray-600">Ativa genes de longevidade</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntermittentFasting;
