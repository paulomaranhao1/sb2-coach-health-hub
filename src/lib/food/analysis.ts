
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
      
      // Se for erro de quota/créditos, usar fallback
      if (error.message?.includes('quota') || error.message?.includes('insufficient_quota')) {
        console.log('Quota da OpenAI excedida, usando análise mock...');
        return await analyzeFoodImageMock(imageData);
      }
      
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      console.error('Nenhum dado retornado da análise');
      throw new Error('Nenhum dado retornado da análise');
    }

    console.log('Resposta da OpenAI Vision API:', data);
    
    // Verificar se é uma resposta real da OpenAI (não fallback da edge function)
    const isRealAnalysis = data.foods && 
                          data.foods.length > 0 && 
                          !data.foods[0].name.includes('indisponível') &&
                          !data.foods[0].name.includes('não identificado') &&
                          data.recommendations && 
                          !data.recommendations.some((rec: string) => 
                            rec.includes('indisponível') || 
                            rec.includes('temporariamente') ||
                            rec.includes('Não foi possível')
                          );
    
    if (isRealAnalysis) {
      console.log('✅ Análise real da OpenAI Vision API concluída com sucesso!');
      return data as FoodAnalysis;
    } else {
      console.log('⚠️ Edge function retornou dados de fallback, usando análise mock local...');
      return await analyzeFoodImageMock(imageData);
    }

  } catch (error) {
    console.error('Erro na análise com OpenAI Vision API:', error);
    
    // Fallback para análise mock em caso de erro
    console.log('Usando análise mock como fallback...');
    return await analyzeFoodImageMock(imageData);
  }
};
