
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

    // Como não temos a tabela food_analyses, vamos salvar os dados no localStorage
    // e atualizar apenas as estatísticas do usuário
    const existingAnalyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    const newAnalysis = {
      id: Date.now().toString(),
      user_id: user.id,
      foods: analysis.foods,
      total_calories: analysis.totalCalories,
      macros: analysis.macros,
      recommendations: analysis.recommendations,
      image_url: imageUrl,
      analyzed_at: analysis.timestamp
    };
    
    existingAnalyses.unshift(newAnalysis);
    localStorage.setItem('food_analyses', JSON.stringify(existingAnalyses.slice(0, 50))); // Manter apenas os últimos 50

    // Atualizar pontos do usuário (gamificação)
    await updateUserPoints(user.id, 10); // 10 pontos por análise

  } catch (error) {
    console.error('Erro ao salvar análise de alimentos:', error);
    throw error;
  }
};

const updateUserPoints = async (userId: string, points: number) => {
  try {
    // Buscar estatísticas atuais
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (stats) {
      // Atualizar pontos
      const { error } = await supabase
        .from('user_stats')
        .update({
          points: (stats.points || 0) + points,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao atualizar pontos:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar pontos do usuário:', error);
  }
};

export const getFoodAnalysisHistory = async (limit: number = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar do localStorage já que não temos a tabela no Supabase
    const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    return analyses
      .filter((analysis: any) => analysis.user_id === user.id)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Erro ao buscar histórico de análises:', error);
    return [];
  }
};
