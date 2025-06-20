
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Camera, TrendingUp, Target } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const CalorieStats = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalCalories: 0,
    averageCalories: 0,
    mostCommonFood: 'N/A',
    thisWeekAnalyses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar dados do localStorage
      const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
      const userAnalyses = analyses.filter((analysis: any) => analysis.user_id === user.id);

      if (userAnalyses.length === 0) {
        setLoading(false);
        return;
      }

      // Calcular estatísticas
      const totalCalories = userAnalyses.reduce((sum: number, analysis: any) => sum + (analysis.total_calories || 0), 0);
      const averageCalories = totalCalories / userAnalyses.length;

      // Análises desta semana
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeekAnalyses = userAnalyses.filter((analysis: any) => 
        new Date(analysis.analyzed_at) > oneWeekAgo
      ).length;

      // Alimento mais comum
      const foodCounts: { [key: string]: number } = {};
      userAnalyses.forEach((analysis: any) => {
        if (analysis.foods && Array.isArray(analysis.foods)) {
          analysis.foods.forEach((food: any) => {
            if (food.name) {
              foodCounts[food.name] = (foodCounts[food.name] || 0) + 1;
            }
          });
        }
      });

      const mostCommonFood = Object.keys(foodCounts).length > 0 
        ? Object.keys(foodCounts).reduce((a, b) => foodCounts[a] > foodCounts[b] ? a : b)
        : 'N/A';

      setStats({
        totalAnalyses: userAnalyses.length,
        totalCalories: Math.round(totalCalories),
        averageCalories: Math.round(averageCalories),
        mostCommonFood,
        thisWeekAnalyses
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          📊 Suas Estatísticas
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Acompanhe seu progresso na análise de calorias
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total de Análises
            </CardTitle>
            <Camera className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalAnalyses}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              fotos analisadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Total de Calorias
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.totalCalories.toLocaleString()}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              calorias rastreadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Média por Refeição
            </CardTitle>
            <Target className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.averageCalories}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              calorias em média
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Esta Semana
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.thisWeekAnalyses}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              análises nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Alimento mais fotografado:
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {stats.mostCommonFood}
            </span>
          </div>

          {stats.totalAnalyses > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🎉 Parabéns!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Você já analisou {stats.totalAnalyses} refeições e está no caminho certo para uma alimentação mais consciente!
              </p>
            </div>
          )}

          {stats.totalAnalyses === 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg text-center">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🚀 Comece sua jornada!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tire sua primeira foto e descubra as calorias dos seus alimentos!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalorieStats;
