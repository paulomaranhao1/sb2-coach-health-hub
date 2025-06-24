
import { supabase } from '@/integrations/supabase/client';
import { FoodAnalysis } from './types';

export const saveFoodAnalysis = async (analysis: FoodAnalysis, imageData?: string): Promise<{ success: boolean; id?: string }> => {
  try {
    console.log('🗃️ Salvando análise de alimento no Supabase...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('⚠️ Usuário não autenticado, salvando apenas no localStorage');
      const savedAnalysis = saveToLocalStorage(analysis);
      return { success: true, id: savedAnalysis.id };
    }

    const analysisData = {
      user_id: user.id,
      foods: analysis.foods as any, // Cast para Json
      total_calories: analysis.totalCalories,
      macros: analysis.macros as any, // Cast para Json
      recommendations: analysis.recommendations || [],
      analyzed_at: analysis.timestamp,
      image_url: imageData || null
    };

    const { data, error } = await supabase
      .from('food_analyses')
      .insert(analysisData)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erro ao salvar no Supabase:', error);
      // Fallback para localStorage se falhar
      const savedAnalysis = saveToLocalStorage(analysis);
      return { success: false, id: savedAnalysis.id };
    }

    console.log('✅ Análise salva no Supabase com sucesso');
    return { success: true, id: data.id };
  } catch (error) {
    console.error('❌ Erro geral ao salvar análise:', error);
    // Fallback para localStorage
    const savedAnalysis = saveToLocalStorage(analysis);
    return { success: false, id: savedAnalysis.id };
  }
};

const saveToLocalStorage = (analysis: FoodAnalysis) => {
  try {
    const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    const analysisWithId = {
      ...analysis,
      id: crypto.randomUUID(),
      user_id: 'anonymous'
    };
    analyses.unshift(analysisWithId);
    
    // Manter apenas os últimos 50 registros no localStorage
    const limitedAnalyses = analyses.slice(0, 50);
    localStorage.setItem('food_analyses', JSON.stringify(limitedAnalyses));
    console.log('💾 Análise salva no localStorage');
    return analysisWithId;
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
    return { ...analysis, id: crypto.randomUUID(), user_id: 'anonymous' };
  }
};

export const getFoodAnalyses = async (limit: number = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('📊 Buscando análises do usuário logado...');
      const { data, error } = await supabase
        .from('food_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('analyzed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Erro ao buscar do Supabase:', error);
        return getFromLocalStorage(limit);
      }

      if (data && data.length > 0) {
        console.log(`✅ Encontradas ${data.length} análises no Supabase`);
        return data.map(transformSupabaseData);
      }
    }

    // Fallback para localStorage
    return getFromLocalStorage(limit);
  } catch (error) {
    console.error('❌ Erro ao buscar análises:', error);
    return getFromLocalStorage(limit);
  }
};

const getFromLocalStorage = (limit: number) => {
  try {
    const analyses = JSON.parse(localStorage.getItem('food_analyses') || '[]');
    console.log(`💾 Usando ${analyses.length} análises do localStorage`);
    return analyses.slice(0, limit);
  } catch (error) {
    console.error('❌ Erro ao acessar localStorage:', error);
    return [];
  }
};

const transformSupabaseData = (data: any): FoodAnalysis => ({
  foods: data.foods,
  totalCalories: data.total_calories,
  macros: data.macros,
  recommendations: data.recommendations || [],
  timestamp: data.analyzed_at,
  analysisType: 'supabase_data'
});
