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
        <TabsList className="grid w-full grid-cols-3 bg-inherit">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Analisar Foto
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estatísticas
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