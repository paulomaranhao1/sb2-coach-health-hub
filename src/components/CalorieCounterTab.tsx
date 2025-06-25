
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
    <div className="space-y-6">
      {/* Header Section */}
      <CalorieCounterHeader />

      {/* Abas principais - Layout vertical */}
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="flex flex-col h-auto w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl p-3 shadow-xl space-y-2">
          <TabsTrigger 
            value="analyze" 
            className="w-full flex items-center justify-start gap-4 rounded-xl px-6 py-5 font-bold text-base transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-indigo-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden min-h-[60px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <Camera className="w-6 h-6 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <div className="flex flex-col items-start relative z-10">
              <span className="font-bold text-lg">Analisar Foto</span>
              <span className="text-sm opacity-75 font-normal">Tire uma foto e descubra as calorias</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="history" 
            className="w-full flex items-center justify-start gap-4 rounded-xl px-6 py-5 font-bold text-base transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-green-600 data-[state=active]:to-teal-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden min-h-[60px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <History className="w-6 h-6 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <div className="flex flex-col items-start relative z-10">
              <span className="font-bold text-lg">Histórico</span>
              <span className="text-sm opacity-75 font-normal">Veja suas análises anteriores</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="stats" 
            className="w-full flex items-center justify-start gap-4 rounded-xl px-6 py-5 font-bold text-base transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-red-500 data-[state=active]:to-pink-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-orange-500/40 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden min-h-[60px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-400/0 
                          opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
            <BarChart3 className="w-6 h-6 flex-shrink-0 relative z-10 group-data-[state=active]:drop-shadow-sm" />
            <div className="flex flex-col items-start relative z-10">
              <span className="font-bold text-lg">Estatísticas</span>
              <span className="text-sm opacity-75 font-normal">Acompanhe seu progresso</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6 mt-8">
          <PhotoAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-8">
          <AnalysisHistory refreshTrigger={refreshHistoryTrigger} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-8">
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
