
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Camera, TrendingUp, Target } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface FoodAnalysis {
  user_id: string;
  total_calories: number;
  analyzed_at: string;
  foods: Array<{ name: string }>;
}

interface CalorieStatsData {
  totalAnalyses: number;
  totalCalories: number;
  averageCalories: number;
  mostCommonFood: string;
  thisWeekAnalyses: number;
}

const CalorieStats = () => {
  const [stats, setStats] = useState<CalorieStatsData>({
    totalAnalyses: 0,
    totalCalories: 0,
    averageCalories: 0,
    mostCommonFood: 'N/A',
    thisWeekAnalyses: 0
  });
  const [loading, setLoading] = useState(true);

  // Memoizar o cálculo das estatísticas
  const calculateStats = useCallback((analyses: FoodAnalysis[]): CalorieStatsData => {
    if (analyses.length === 0) {
      return {
        totalAnalyses: 0,
        totalCalories: 0,
        averageCalories: 0,
        mostCommonFood: 'N/A',
        thisWeekAnalyses: 0
      };
    }

    // Calcular total de calorias
    const totalCalories = analyses.reduce((sum, analysis) => sum + (analysis.total_calories || 0), 0);
    const averageCalories = totalCalories / analyses.length;

    // Análises desta semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekAnalyses = analyses.filter(analysis => 
      new Date(analysis.analyzed_at) > oneWeekAgo
    ).length;

    // Alimento mais comum (otimizado)
    const foodCounts = analyses.reduce((counts, analysis) => {
      if (analysis.foods && Array.isArray(analysis.foods)) {
        analysis.foods.forEach(food => {
          if (food.name) {
            counts[food.name] = (counts[food.name] || 0) + 1;
          }
        });
      }
      return counts;
    }, {} as Record<string, number>);

    const mostCommonFood = Object.keys(foodCounts).length > 0 
      ? Object.keys(foodCounts).reduce((a, b) => foodCounts[a] > foodCounts[b] ? a : b)
      : 'N/A';

    return {
      totalAnalyses: analyses.length,
      totalCalories: Math.round(totalCalories),
      averageCalories: Math.round(averageCalories),
      mostCommonFood,
      thisWeekAnalyses
    };
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar dados do localStorage (otimizado)
      const analysesString = localStorage.getItem('food_analyses');
      if (!analysesString) {
        setLoading(false);
        return;
      }

      const allAnalyses: FoodAnalysis[] = JSON.parse(analysesString);
      const userAnalyses = allAnalyses.filter(analysis => analysis.user_id === user.id);

      const calculatedStats = calculateStats(userAnalyses);
      setStats(calculatedStats);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Memoizar os cards de loading
  const loadingCards = useMemo(() => (
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
  ), []);

  // Memoizar os dados dos cards principais
  const statsCards = useMemo(() => [
    {
      title: "Total de Análises",
      value: stats.totalAnalyses,
      description: "fotos analisadas",
      icon: Camera,
      gradient: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
      iconColor: "text-blue-600",
      valueColor: "text-blue-900 dark:text-blue-100",
      descColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "Total de Calorias",
      value: stats.totalCalories.toLocaleString(),
      description: "calorias rastreadas",
      icon: TrendingUp,
      gradient: "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800",
      textColor: "text-green-800 dark:text-green-200",
      iconColor: "text-green-600",
      valueColor: "text-green-900 dark:text-green-100",
      descColor: "text-green-700 dark:text-green-300"
    },
    {
      title: "Média por Refeição",
      value: stats.averageCalories,
      description: "calorias em média",
      icon: Target,
      gradient: "from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
      textColor: "text-purple-800 dark:text-purple-200",
      iconColor: "text-purple-600",
      valueColor: "text-purple-900 dark:text-purple-100",
      descColor: "text-purple-700 dark:text-purple-300"
    },
    {
      title: "Esta Semana",
      value: stats.thisWeekAnalyses,
      description: "análises nos últimos 7 dias",
      icon: BarChart3,
      gradient: "from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800",
      textColor: "text-orange-800 dark:text-orange-200",
      iconColor: "text-orange-600",
      valueColor: "text-orange-900 dark:text-orange-100",
      descColor: "text-orange-700 dark:text-orange-300"
    }
  ], [stats]);

  if (loading) {
    return loadingCards;
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
        {statsCards.map((card, index) => (
          <Card key={index} className={`bg-gradient-to-br ${card.gradient}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </CardTitle>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </div>
              <p className={`text-xs ${card.descColor}`}>
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
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

          {stats.totalAnalyses > 0 ? (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🎉 Parabéns!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Você já analisou {stats.totalAnalyses} refeições e está no caminho certo para uma alimentação mais consciente!
              </p>
            </div>
          ) : (
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
