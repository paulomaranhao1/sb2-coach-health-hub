import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, History, BarChart3 } from "lucide-react";
import PhotoAnalyzer from "./PhotoAnalyzer";
import AnalysisHistory from "./AnalysisHistory";
import CalorieStats from "./CalorieStats";
import CalorieCounterHeader from "./CalorieCounterHeader";

const CalorieCounterTab = () => {
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);

  const handleAnalysisComplete = (analysis: any) => {
    setRefreshHistoryTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <CalorieCounterHeader />

      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="flex flex-col h-auto w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl p-4 shadow-xl space-y-3">
          <TabsTrigger 
            value="analyze" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <Camera className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Analisar Foto</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="history" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <History className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Histórico</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="stats" 
            className="w-full flex items-center justify-center gap-3 rounded-xl px-8 py-6 font-bold text-lg transition-all duration-300 ease-out
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 
              data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 
              data-[state=active]:scale-105 data-[state=active]:border-0 data-[state=active]:-translate-y-1
              hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:scale-102 hover:shadow-lg
              text-slate-700 border-2 border-transparent group relative overflow-hidden"
          >
            <BarChart3 className="w-7 h-7 flex-shrink-0 group-data-[state=active]:drop-shadow-sm" />
            <span className="font-bold">Estatísticas</span>
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