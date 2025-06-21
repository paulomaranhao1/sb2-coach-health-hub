
import { supabase } from '@/integrations/supabase/client';
import { FoodAnalysis } from './types';

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

export const saveFoodAnalysis = async (analysis: FoodAnalysis, imageUrl: string | null = null) => {
  try {
    console.log('Iniciando salvamento da análise...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Usuário não autenticado, salvando apenas no localStorage');
      
      // Salvar no localStorage para usuários não autenticados
      const analysisData = {
        id: Date.now().toString(),
        user_id: 'anonymous',
        foods: analysis.foods,
        total_calories: analysis.totalCalories,
        macros: analysis.macros,
        recommendations: analysis.recommendations,
        image_url: imageUrl,
        analyzed_at: analysis.timestamp
      };

      const existingAnalyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
      existingAnalyses.unshift(analysisData);
      localStorage.setItem('food_analyses', JSON.stringify(existingAnalyses.slice(0, 50)));
      
      return analysisData;
    }
    
    // Preparar dados para salvamento
    const analysisData = {
      id: Date.now().toString(),
      user_id: user.id,
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
    console.log('✅ Análise salva no localStorage com sucesso');

    // Tentar salvar no Supabase
    try {
      console.log('Tentando salvar no Supabase...');
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('food_analyses')
        .insert({
          user_id: user.id,
          foods: analysis.foods as any,
          total_calories: analysis.totalCalories,
          macros: analysis.macros as any,
          recommendations: analysis.recommendations,
          image_url: imageUrl,
          analyzed_at: analysis.timestamp
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('❌ Erro ao salvar no Supabase:', supabaseError);
        throw new Error(`Erro no Supabase: ${supabaseError.message}`);
      } else {
        console.log('✅ Análise salva no Supabase com sucesso:', supabaseData);
        
        // Atualizar pontos do usuário apenas se salvou no Supabase
        await updateUserPoints(user.id, 10);
        
        return supabaseData;
      }
    } catch (supabaseError: any) {
      console.error('❌ Erro na comunicação com Supabase:', supabaseError);
      
      // Retornar dados do localStorage como fallback
      console.log('📱 Usando dados do localStorage como fallback');
      return analysisData;
    }

  } catch (error: any) {
    console.error('❌ Erro crítico ao salvar análise:', error);
    throw new Error(`Falha ao salvar a análise: ${error.message}`);
  }
};
