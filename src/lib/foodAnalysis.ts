
import { supabase } from '@/integrations/supabase/client';

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  confidence: number;
}

export interface FoodAnalysis {
  foods: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  recommendations: string[];
  timestamp: string;
}

// Simulação de análise de IA (em produção, seria uma chamada para uma API de visão computacional)
export const analyzeFoodImage = async (imageData: string): Promise<FoodAnalysis> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Dados de exemplo - em produção isso viria de uma API de IA real
  const mockAnalysis: FoodAnalysis = {
    foods: [
      {
        name: "Peito de Frango Grelhado",
        quantity: "150g",
        calories: 248,
        confidence: 0.92
      },
      {
        name: "Arroz Branco",
        quantity: "100g (1/2 xícara)",
        calories: 130,
        confidence: 0.88
      },
      {
        name: "Brócolis Refogado",
        quantity: "80g",
        calories: 22,
        confidence: 0.85
      },
      {
        name: "Azeite de Oliva",
        quantity: "1 colher de sopa",
        calories: 119,
        confidence: 0.78
      }
    ],
    totalCalories: 519,
    macros: {
      protein: 45.2,
      carbs: 28.5,
      fat: 12.8,
      fiber: 3.2
    },
    recommendations: [
      "Excelente combinação de proteína magra e vegetais! Continue assim.",
      "Considere adicionar mais vegetais para aumentar a fibra.",
      "Para ganho de massa, você pode aumentar a porção de arroz.",
      "Ótima escolha de gordura saudável com o azeite de oliva."
    ],
    timestamp: new Date().toISOString()
  };

  return mockAnalysis;
};

export const saveFoodAnalysis = async (analysis: FoodAnalysis, imageUrl: string | null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Salvar a análise no banco de dados
    const { error } = await supabase
      .from('food_analyses')
      .insert({
        user_id: user.id,
        foods: analysis.foods,
        total_calories: analysis.totalCalories,
        macros: analysis.macros,
        recommendations: analysis.recommendations,
        image_url: imageUrl,
        analyzed_at: analysis.timestamp
      });

    if (error) {
      console.error('Erro ao salvar análise:', error);
      throw error;
    }

    // Atualizar estatísticas do usuário
    await updateUserStats(user.id, analysis.totalCalories);

  } catch (error) {
    console.error('Erro ao salvar análise de alimentos:', error);
    throw error;
  }
};

const updateUserStats = async (userId: string, calories: number) => {
  try {
    // Buscar estatísticas atuais
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (stats) {
      // Atualizar estatísticas existentes
      const { error } = await supabase
        .from('user_stats')
        .update({
          total_photos_analyzed: (stats.total_photos_analyzed || 0) + 1,
          total_calories_tracked: (stats.total_calories_tracked || 0) + calories,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao atualizar estatísticas:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas do usuário:', error);
  }
};

export const getFoodAnalysisHistory = async (limit: number = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('food_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('analyzed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de análises:', error);
    throw error;
  }
};
