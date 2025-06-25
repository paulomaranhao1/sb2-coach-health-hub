import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, History, BarChart3 } from "lucide-react";
import PhotoAnalyzer from "@/features/calorie-counter/components/PhotoAnalyzer";
import AnalysisHistory from "./calorie-counter/AnalysisHistory";
import CalorieStats from "./calorie-counter/CalorieStats";
import CalorieCounterHeader from "./calorie-counter/CalorieCounterHeader";
const CalorieCounterTab = () => {
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);
  const handleAnalysisComplete = (analysis: any) => {
    // Atualizar histórico quando uma nova análise for concluída
    setRefreshHistoryTrigger(prev => prev + 1);
  };
  return <div className="space-y-4">
      {/* Header Section */}
      <CalorieCounterHeader />

      {/* Abas principais */}
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-white via-slate-50 to-white border-2 border-slate-200/80 rounded-2xl p-2 shadow-lg backdrop-blur-sm py-0">
          <TabsTrigger value="analyze" className="flex items-center gap-2 rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 data-[state=active]:scale-[1.02] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-[1.01] text-slate-600 border border-transparent">
            <Camera className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Analisar Foto</span>
            <span className="sm:hidden">Analisar</span>
          </TabsTrigger>
          
          <TabsTrigger value="history" className="flex items-center gap-2 rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:via-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-green-500/30 data-[state=active]:scale-[1.02] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 hover:scale-[1.01] text-slate-600 border border-transparent">
            <History className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Histórico</span>
            <span className="sm:hidden">Histórico</span>
          </TabsTrigger>
          
          <TabsTrigger value="stats" className="flex items-center gap-2 rounded-xl px-4 py-3.5 font-bold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:scale-[1.01] text-slate-600 border border-transparent">
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Estatísticas</span>
            <span className="sm:hidden">Estatísticas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <PhotoAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AnalysisHistory refreshTrigger={refreshHistoryTrigger} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <CalorieStats />
        </TabsContent>
      </Tabs>

      {/* Como Funciona */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-slate-600">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-slate-600">1. Fotografe</h3>
              <p className="text-sm text-slate-500">
                Tire uma foto da sua refeição ou selecione da galeria
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-slate-600">2. IA Analisa</h3>
              <p className="text-sm text-slate-500">
                Nossa inteligência artificial identifica e analisa os alimentos
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-slate-600">3. Resultados</h3>
              <p className="text-sm text-slate-500">
                Receba instantaneamente as informações nutricionais completas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default CalorieCounterTab;