
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Camera, Flame } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const CalorieStats = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalCalories: 0,
    avgCaloriesPerMeal: 0,
    thisWeekAnalyses: 0,
    thisWeekCalories: 0,
    topFoods: [] as Array<{ name: string; count: number; calories: number }>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Buscar todas as análises do usuário
      const { data: analyses, error } = await supabase
        .from('food_analyses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao carregar estatísticas:', error);
        return;
      }

      if (!analyses || analyses.length === 0) {
        setLoading(false);
        return;
      }

      // Calcular estatísticas
      const totalAnalyses = analyses.length;
      const totalCalories = analyses.reduce((sum, analysis) => sum + (analysis.total_calories || 0), 0);
      const avgCaloriesPerMeal = Math.round(totalCalories / totalAnalyses);

      // Análises desta semana
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekAnalyses = analyses.filter(analysis => 
        new Date(analysis.analyzed_at) >= oneWeekAgo
      );
      
      const thisWeekCalories = thisWeekAnalyses.reduce((sum, analysis) => 
        sum + (analysis.total_calories || 0), 0
      );

      // Alimentos mais consumidos
      const foodCounts: { [key: string]: { count: number; calories: number } } = {};
      
      analyses.forEach(analysis => {
        if (analysis.foods && Array.isArray(analysis.foods)) {
          analysis.foods.forEach((food: any) => {
            if (foodCounts[food.name]) {
              foodCounts[food.name].count++;
              foodCounts[food.name].calories += food.calories || 0;
            } else {
              foodCounts[food.name] = {
                count: 1,
                calories: food.calories || 0
              };
            }
          });
        }
      });

      const topFoods = Object.entries(foodCounts)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalAnalyses,
        totalCalories,
        avgCaloriesPerMeal,
        thisWeekAnalyses: thisWeekAnalyses.length,
        thisWeekCalories,
        topFoods
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando estatísticas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stats.totalAnalyses === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Sem dados ainda</p>
            <p className="text-sm">Analise algumas fotos para ver suas estatísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Análises</p>
                <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Flame className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Calorias</p>
                <p className="text-2xl font-bold">{stats.totalCalories.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média por Refeição</p>
                <p className="text-2xl font-bold">{stats.avgCaloriesPerMeal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold">{stats.thisWeekAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calorias Esta Semana */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Calorias analisadas esta semana:</span>
              <span className="text-2xl font-bold text-blue-600">{stats.thisWeekCalories.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média diária:</span>
              <span className="text-lg font-medium">{Math.round(stats.thisWeekCalories / 7).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alimentos Mais Consumidos */}
      {stats.topFoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alimentos Mais Analisados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topFoods.map((food, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      {food.count} {food.count === 1 ? 'vez' : 'vezes'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{Math.round(food.calories / food.count)}</div>
                    <div className="text-xs text-gray-500">cal/porção</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalorieStats;
