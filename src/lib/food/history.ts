
import { supabase } from '@/integrations/supabase/client';

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
