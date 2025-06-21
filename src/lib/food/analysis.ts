
import { supabase } from '@/integrations/supabase/client';
import { FoodAnalysis } from './types';
import { analyzeFoodImageMock } from './mockAnalysis';

export const analyzeFoodImage = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('🔍 Iniciando análise de imagem de alimento...');
  
  try {
    console.log('🚀 Chamando OpenAI Vision API via edge function...');
    
    const { data, error } = await supabase.functions.invoke('analyze-food-image', {
      body: { imageData }
    });

    if (error) {
      console.error('❌ Erro da edge function:', error);
      
      // Enhanced quota error detection
      const isQuotaError = error.message?.includes('quota') || 
                          error.message?.includes('insufficient_quota') ||
                          error.message?.includes('QUOTA_EXCEEDED') ||
                          error.message?.includes('rate_limit') ||
                          error.message?.includes('billing') ||
                          error.message?.includes('credits');
      
      if (isQuotaError) {
        console.log('💳 Quota da OpenAI excedida detectada, usando análise local...');
        return await analyzeFoodImageMock(imageData);
      }
      
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      console.error('❌ Nenhum dado retornado da análise');
      throw new Error('Nenhum dado retornado da análise');
    }

    console.log('📊 Resposta recebida:', {
      foods: data.foods?.length || 0,
      totalCalories: data.totalCalories,
      analysisType: data.analysisType,
      isAnalysisUnavailable: data.isAnalysisUnavailable
    });
    
    // Enhanced real analysis detection
    const isRealAnalysis = data.analysisType === 'openai_real' && 
                          !data.isAnalysisUnavailable &&
                          !data.quotaExceeded &&
                          data.foods && 
                          data.foods.length > 0 && 
                          !data.foods.some((food: any) => 
                            food.name.includes('indisponível') ||
                            food.name.includes('não identificado') ||
                            food.name.includes('simulado') ||
                            food.name.includes('mock')
                          );
    
    if (isRealAnalysis) {
      console.log('✅ Análise real da OpenAI Vision API concluída com sucesso!');
      return data as FoodAnalysis;
    } else {
      // Handle various fallback scenarios
      if (data.quotaExceeded) {
        console.log('💳 Quota excedida detectada na resposta, usando análise local...');
      } else if (data.isAnalysisUnavailable) {
        console.log('⚠️ Análise indisponível, usando dados locais...');
      } else {
        console.log('🔄 Dados de fallback detectados, usando análise local...');
      }
      
      return await analyzeFoodImageMock(imageData);
    }

  } catch (error) {
    console.error('❌ Erro na comunicação com OpenAI Vision API:', error);
    
    // Enhanced error categorization
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('quota') || 
        errorMessage.includes('rate_limit') || 
        errorMessage.includes('billing')) {
      console.log('💳 Erro de quota detectado, usando análise local...');
    } else {
      console.log('🔄 Erro genérico, usando análise local como fallback...');
    }
    
    return await analyzeFoodImageMock(imageData);
  }
};
