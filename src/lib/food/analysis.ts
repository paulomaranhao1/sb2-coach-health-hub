
import { supabase } from '@/integrations/supabase/client';
import { FoodAnalysis } from './types';
import { analyzeFoodImageMock } from './mockAnalysis';

export const analyzeFoodImage = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('Iniciando análise de imagem de alimento...');
  
  try {
    console.log('Tentando usar OpenAI Vision API...');
    
    // Chamar a edge function que usa OpenAI Vision API
    const { data, error } = await supabase.functions.invoke('analyze-food-image', {
      body: { imageData }
    });

    if (error) {
      console.error('Erro da edge function:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      console.error('Nenhum dado retornado da análise');
      throw new Error('Nenhum dado retornado da análise');
    }

    console.log('Análise concluída com OpenAI Vision API:', data);
    
    // Verificar se é uma resposta de fallback da edge function
    const hasRealAnalysis = data.foods && data.foods.length > 0 && 
                           !data.foods[0].name.includes('indisponível') &&
                           !data.recommendations?.some((rec: string) => rec.includes('indisponível'));
    
    if (hasRealAnalysis) {
      return data as FoodAnalysis;
    } else {
      console.log('Edge function retornou fallback, usando análise mock local...');
      throw new Error('API temporariamente indisponível');
    }

  } catch (error) {
    console.error('Erro na análise com OpenAI Vision API:', error);
    
    // Fallback para análise mock em caso de erro
    console.log('Usando análise mock como fallback...');
    return await analyzeFoodImageMock(imageData);
  }
};
