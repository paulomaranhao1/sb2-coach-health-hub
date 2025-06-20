
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
  console.log('Iniciando análise de imagem de alimento...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Gerar dados mais variados baseados no timestamp para simular diferentes análises
  const timestamp = Date.now();
  const foodOptions = [
    {
      name: "Peito de Frango Grelhado",
      quantity: "150g",
      calories: 248,
      confidence: 0.92
    },
    {
      name: "Salmão Grelhado",
      quantity: "120g",
      calories: 206,
      confidence: 0.89
    },
    {
      name: "Filé de Tilápia",
      quantity: "130g",
      calories: 128,
      confidence: 0.87
    }
  ];

  const carbOptions = [
    {
      name: "Arroz Branco",
      quantity: "100g (1/2 xícara)",
      calories: 130,
      confidence: 0.88
    },
    {
      name: "Batata Doce",
      quantity: "80g",
      calories: 86,
      confidence: 0.85
    },
    {
      name: "Quinoa",
      quantity: "90g",
      calories: 120,
      confidence: 0.83
    }
  ];

  const vegOptions = [
    {
      name: "Brócolis Refogado",
      quantity: "80g",
      calories: 22,
      confidence: 0.85
    },
    {
      name: "Salada Verde",
      quantity: "100g",
      calories: 15,
      confidence: 0.78
    },
    {
      name: "Cenoura Refogada",
      quantity: "60g",
      calories: 25,
      confidence: 0.82
    }
  ];

  // Selecionar alimentos baseado no timestamp para variar
  const selectedProtein = foodOptions[timestamp % foodOptions.length];
  const selectedCarb = carbOptions[timestamp % carbOptions.length];
  const selectedVeg = vegOptions[timestamp % vegOptions.length];
  
  const totalCalories = selectedProtein.calories + selectedCarb.calories + selectedVeg.calories + 119; // +azeite

  const mockAnalysis: FoodAnalysis = {
    foods: [
      selectedProtein,
      selectedCarb,
      selectedVeg,
      {
        name: "Azeite de Oliva",
        quantity: "1 colher de sopa",
        calories: 119,
        confidence: 0.78
      }
    ],
    totalCalories,
    macros: {
      protein: Math.round(totalCalories * 0.3 / 4), // 30% proteína
      carbs: Math.round(totalCalories * 0.4 / 4), // 40% carboidratos
      fat: Math.round(totalCalories * 0.3 / 9), // 30% gordura
      fiber: Math.round(Math.random() * 8 + 2) // 2-10g fibra
    },
    recommendations: [
      "Excelente combinação de proteína magra e vegetais! Continue assim.",
      "Considere adicionar mais vegetais para aumentar a fibra.",
      "Para ganho de massa, você pode aumentar a porção de carboidratos.",
      "Ótima escolha de gordura saudável com o azeite de oliva."
    ],
    timestamp: new Date().toISOString()
  };

  console.log('Análise concluída:', mockAnalysis);
  return mockAnalysis;
};

export const saveFoodAnalysis = async (analysis: FoodAnalysis, imageUrl: string | null = null) => {
  try {
    console.log('Salvando análise de alimento...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('Usuário não autenticado, salvando localmente');
      // Se não houver usuário, ainda assim salva localmente
    }

    // Salvar dados no localStorage
    const existingAnalyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    const newAnalysis = {
      id: Date.now().toString(),
      user_id: user?.id || 'anonymous',
      foods: analysis.foods,
      total_calories: analysis.totalCalories,
      macros: analysis.macros,
      recommendations: analysis.recommendations,
      image_url: imageUrl,
      analyzed_at: analysis.timestamp
    };
    
    existingAnalyses.unshift(newAnalysis);
    localStorage.setItem('food_analyses', JSON.stringify(existingAnalyses.slice(0, 50))); // Manter apenas os últimos 50
    
    console.log('Análise salva com sucesso:', newAnalysis);

    // Atualizar pontos do usuário se estiver logado
    if (user) {
      await updateUserPoints(user.id, 10); // 10 pontos por análise
    }

    return newAnalysis;

  } catch (error) {
    console.error('Erro ao salvar análise de alimentos:', error);
    // Não throw error para não quebrar o fluxo
    return null;
  }
};

const updateUserPoints = async (userId: string, points: number) => {
  try {
    console.log('Atualizando pontos do usuário...');
    
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
      } else {
        console.log('Pontos atualizados com sucesso');
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar pontos do usuário:', error);
  }
};

export const getFoodAnalysisHistory = async (limit: number = 10) => {
  try {
    console.log('Buscando histórico de análises...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar do localStorage
    const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    
    let filteredAnalyses = analyses;
    
    // Se houver usuário, filtrar por usuário, senão mostrar todas (incluindo anônimas)
    if (user) {
      filteredAnalyses = analyses.filter((analysis: any) => 
        analysis.user_id === user.id || analysis.user_id === 'anonymous'
      );
    }
    
    console.log('Histórico encontrado:', filteredAnalyses.length, 'análises');
    return filteredAnalyses.slice(0, limit);
      
  } catch (error) {
    console.error('Erro ao buscar histórico de análises:', error);
    return [];
  }
};
