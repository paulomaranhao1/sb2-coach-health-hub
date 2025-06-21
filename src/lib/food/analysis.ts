
import { supabase } from '@/integrations/supabase/client';
import { FoodAnalysis } from './types';
import { analyzeFoodImageMock } from './mockAnalysis';

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
