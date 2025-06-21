
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

// Função principal que usa OpenAI Vision API
export const analyzeFoodImage = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('Iniciando análise de imagem de alimento com OpenAI Vision API...');
  
  try {
    // Chamar a edge function que usa OpenAI Vision API
    const { data, error } = await supabase.functions.invoke('analyze-food-image', {
      body: { imageData }
    });

    if (error) {
      console.error('Erro ao chamar edge function:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Nenhum dado retornado da análise');
    }

    console.log('Análise concluída com OpenAI Vision API:', data);
    return data as FoodAnalysis;

  } catch (error) {
    console.error('Erro na análise com OpenAI Vision API:', error);
    
    // Fallback para análise mock em caso de erro
    console.log('Usando análise mock como fallback...');
    return await analyzeFoodImageMock(imageData);
  }
};

// Função mock mantida como fallback
const analyzeFoodImageMock = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('Usando análise mock de fallback...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Gerar dados variados baseados no timestamp
  const timestamp = Date.now();
  const foodOptions = [
    {
      name: "Peito de Frango Grelhado",
      quantity: "150g",
      calories: 248,
      confidence: 0.75
    },
    {
      name: "Salmão Grelhado",
      quantity: "120g",
      calories: 206,
      confidence: 0.72
    },
    {
      name: "Filé de Tilápia",
      quantity: "130g",
      calories: 128,
      confidence: 0.70
    }
  ];

  const carbOptions = [
    {
      name: "Arroz Branco",
      quantity: "100g (1/2 xícara)",
      calories: 130,
      confidence: 0.68
    },
    {
      name: "Batata Doce",
      quantity: "80g",
      calories: 86,
      confidence: 0.65
    },
    {
      name: "Quinoa",
      quantity: "90g",
      calories: 120,
      confidence: 0.63
    }
  ];

  const vegOptions = [
    {
      name: "Brócolis Refogado",
      quantity: "80g",
      calories: 22,
      confidence: 0.60
    },
    {
      name: "Salada Verde",
      quantity: "100g",
      calories: 15,
      confidence: 0.58
    },
    {
      name: "Cenoura Refogada",
      quantity: "60g",
      calories: 25,
      confidence: 0.62
    }
  ];

  // Selecionar alimentos baseado no timestamp para variar
  const selectedProtein = foodOptions[timestamp % foodOptions.length];
  const selectedCarb = carbOptions[timestamp % carbOptions.length];
  const selectedVeg = vegOptions[timestamp % vegOptions.length];
  
  const totalCalories = selectedProtein.calories + selectedCarb.calories + selectedVeg.calories + 119;

  const mockAnalysis: FoodAnalysis = {
    foods: [
      selectedProtein,
      selectedCarb,
      selectedVeg,
      {
        name: "Azeite de Oliva",
        quantity: "1 colher de sopa",
        calories: 119,
        confidence: 0.55
      }
    ],
    totalCalories,
    macros: {
      protein: Math.round(totalCalories * 0.3 / 4),
      carbs: Math.round(totalCalories * 0.4 / 4),
      fat: Math.round(totalCalories * 0.3 / 9),
      fiber: Math.round(Math.random() * 8 + 2)
    },
    recommendations: [
      "⚠️ Análise simulada - Para resultados reais, verifique a conexão com OpenAI.",
      "Considere adicionar mais vegetais para aumentar a fibra.",
      "Ótima escolha de proteína magra!",
      "Para análise precisa, use o sistema de IA real."
    ],
    timestamp: new Date().toISOString()
  };

  console.log('Análise mock concluída:', mockAnalysis);
  return mockAnalysis;
};

export const saveFoodAnalysis = async (analysis: FoodAnalysis, imageUrl: string | null = null) => {
  try {
    console.log('Iniciando salvamento da análise...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Preparar dados para salvamento
    const analysisData = {
      id: Date.now().toString(),
      user_id: user?.id || 'anonymous',
      foods: analysis.foods,
      total_calories: analysis.totalCalories,
      macros: analysis.macros,
      recommendations: analysis.recommendations,
      image_url: imageUrl,
      analyzed_at: analysis.timestamp
    };

    console.log('Dados preparados para salvamento:', analysisData);

    // Salvar no localStorage primeiro (sempre funciona)
    const existingAnalyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    existingAnalyses.unshift(analysisData);
    localStorage.setItem('food_analyses', JSON.stringify(existingAnalyses.slice(0, 50)));
    console.log('Análise salva no localStorage com sucesso');

    // Tentar salvar no Supabase se usuário estiver logado
    if (user) {
      try {
        console.log('Tentando salvar no Supabase...');
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('food_analyses')
          .insert({
            user_id: user.id,
            foods: analysis.foods,
            total_calories: analysis.totalCalories,
            macros: analysis.macros,
            recommendations: analysis.recommendations,
            image_url: imageUrl,
            analyzed_at: analysis.timestamp
          })
          .select()
          .single();

        if (supabaseError) {
          console.warn('Erro ao salvar no Supabase (usando localStorage):', supabaseError);
        } else {
          console.log('Análise salva no Supabase com sucesso:', supabaseData);
        }

        // Atualizar pontos do usuário
        await updateUserPoints(user.id, 10);
      } catch (supabaseError) {
        console.warn('Erro na comunicação com Supabase (usando localStorage):', supabaseError);
      }
    }

    console.log('Salvamento concluído com sucesso');
    return analysisData;

  } catch (error) {
    console.error('Erro crítico ao salvar análise:', error);
    throw new Error('Falha ao salvar a análise');
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
    
    // Buscar do localStorage primeiro
    const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    
    // Se houver usuário, tentar buscar do Supabase também
    if (user) {
      try {
        const { data: supabaseAnalyses } = await supabase
          .from('food_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('analyzed_at', { ascending: false })
          .limit(limit);
        
        if (supabaseAnalyses && supabaseAnalyses.length > 0) {
          console.log('Usando dados do Supabase');
          return supabaseAnalyses;
        }
      } catch (supabaseError) {
        console.warn('Erro ao buscar do Supabase, usando localStorage:', supabaseError);
      }
    }
    
    // Usar localStorage como fallback
    let filteredAnalyses = analyses;
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
