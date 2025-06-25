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

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <CalorieCounterHeader />

      {/* Abas principais */}
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl p-1.5 shadow-lg">
          <TabsTrigger 
            value="analyze" 
            className="flex items-center gap-2.5 rounded-xl px-4 py-4 font-bold text-sm transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-indigo-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-0.5
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:scale-102 hover:shadow-md
              text-slate-600 border border-transparent group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <Camera className="w-4 h-4 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <span className="hidden sm:inline relative z-10">Analisar Foto</span>
            <span className="sm:hidden relative z-10 font-semibold">Analisar</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="history" 
            className="flex items-center gap-2.5 rounded-xl px-4 py-4 font-bold text-sm transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:via-green-600 data-[state=active]:to-teal-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-0.5
              hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:scale-102 hover:shadow-md
              text-slate-600 border border-transparent group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <History className="w-4 h-4 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <span className="hidden sm:inline relative z-10">Histórico</span>
            <span className="sm:hidden relative z-10 font-semibold">Histórico</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="stats" 
            className="flex items-center gap-2.5 rounded-xl px-4 py-4 font-bold text-sm transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:via-red-500 data-[state=active]:to-pink-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-orange-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-0.5
              hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 hover:scale-102 hover:shadow-md
              text-slate-600 border border-transparent group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <BarChart3 className="w-4 h-4 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <span className="hidden sm:inline relative z-10">Estatísticas</span>
            <span className="sm:hidden relative z-10 font-semibold">Estatísticas</span>
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
    </div>
  );
};

export default CalorieCounterTab;
