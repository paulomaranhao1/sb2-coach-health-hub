
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced quota error detection
const isQuotaError = (error: any, statusCode?: number): boolean => {
  if (statusCode === 429 || statusCode === 402) return true;
  
  const errorMessage = error?.message || error?.toString() || '';
  const quotaKeywords = [
    'quota', 'insufficient_quota', 'rate_limit', 'billing', 
    'credits', 'usage_limit', 'exceeded', 'limit_reached',
    'insufficient funds', 'payment required'
  ];
  
  return quotaKeywords.some(keyword => 
    errorMessage.toLowerCase().includes(keyword)
  );
};

// Retry with exponential backoff
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 2): Promise<any> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = !isQuotaError(error) && !isLastAttempt;
      
      if (shouldRetry) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
};

// Generate enhanced mock analysis
const generateEnhancedMockAnalysis = () => {
  const mockOptions = [
    {
      foods: [
        { name: "Frango Grelhado", quantity: "120g", calories: 195, confidence: 0.85 },
        { name: "Arroz Integral", quantity: "80g", calories: 112, confidence: 0.80 },
        { name: "Brócolis Refogado", quantity: "100g", calories: 34, confidence: 0.90 }
      ],
      totalCalories: 341,
      macros: { protein: 28, carbs: 45, fat: 8, fiber: 6 },
      recommendations: [
        "Refeição bem balanceada com boa proporção de proteínas.",
        "Considere adicionar uma fonte de gordura saudável como abacate.",
        "Excelente escolha de carboidrato complexo com o arroz integral."
      ]
    },
    {
      foods: [
        { name: "Salmão Assado", quantity: "100g", calories: 208, confidence: 0.88 },
        { name: "Batata Doce", quantity: "150g", calories: 129, confidence: 0.82 },
        { name: "Aspargos Grelhados", quantity: "80g", calories: 16, confidence: 0.85 }
      ],
      totalCalories: 353,
      macros: { protein: 31, carbs: 28, fat: 12, fiber: 4 },
      recommendations: [
        "Ótima fonte de ômega-3 com o salmão.",
        "Batata doce fornece carboidratos de qualidade.",
        "Considere adicionar mais vegetais para aumentar as fibras."
      ]
    },
    {
      foods: [
        { name: "Peito de Peru", quantity: "100g", calories: 135, confidence: 0.83 },
        { name: "Quinoa Cozida", quantity: "90g", calories: 120, confidence: 0.78 },
        { name: "Rúcula e Tomate", quantity: "100g", calories: 25, confidence: 0.90 }
      ],
      totalCalories: 280,
      macros: { protein: 25, carbs: 35, fat: 6, fiber: 5 },
      recommendations: [
        "Proteína magra de alta qualidade.",
        "Quinoa é uma excelente fonte de proteína vegetal.",
        "Adicione azeite extra virgem para melhorar a absorção de nutrientes."
      ]
    }
  ];

  const selectedMock = mockOptions[Math.floor(Math.random() * mockOptions.length)];
  
  return {
    ...selectedMock,
    timestamp: new Date().toISOString(),
    isAnalysisUnavailable: true,
    analysisType: 'mock_fallback'
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Iniciando análise de imagem com OpenAI Vision API');
    
    const { imageData } = await req.json();

    if (!imageData) {
      throw new Error('Dados da imagem não fornecidos');
    }

    if (!openAIApiKey) {
      console.log('⚠️ Chave da OpenAI API não configurada, usando análise mock');
      const mockResult = generateEnhancedMockAnalysis();
      return new Response(JSON.stringify(mockResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check quota proactively if possible
    console.log('🔑 Chave OpenAI configurada, tentando análise real...');

    // Optimized prompt for better results
    const systemPrompt = `Você é um especialista em nutrição brasileira. Analise a imagem e identifique TODOS os alimentos visíveis.

INSTRUÇÕES ESPECÍFICAS:
- Identifique alimentos típicos brasileiros (arroz, feijão, farofa, etc.)
- Estime porções baseadas em referências visuais (pratos, talheres)
- Seja preciso nas calorias usando tabelas nutricionais brasileiras
- Forneça recomendações práticas e culturalmente relevantes

FORMATO DE RESPOSTA (JSON apenas):
{
  "foods": [
    {
      "name": "Nome do alimento em português",
      "quantity": "quantidade com unidade",
      "calories": número_exato,
      "confidence": decimal_0_a_1
    }
  ],
  "totalCalories": soma_total,
  "macros": {
    "protein": gramas_proteína,
    "carbs": gramas_carboidratos,
    "fat": gramas_gordura,
    "fiber": gramas_fibra
  },
  "recommendations": [
    "recomendação prática 1",
    "recomendação prática 2"
  ]
}`;

    const analysisResult = await retryWithBackoff(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analise esta imagem de alimento brasileiro e forneça informações nutricionais detalhadas:'
                },
                {
                  type: 'image_url',
                  image_url: { url: imageData }
                }
              ]
            }
          ],
          max_tokens: 1500,
          temperature: 0.1
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erro da OpenAI API (${response.status}):`, errorText);
        
        // Enhanced quota detection
        if (isQuotaError(errorText, response.status)) {
          throw new Error(`QUOTA_EXCEEDED: ${errorText}`);
        }
        
        throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    });

    console.log('✅ Resposta da OpenAI recebida:', analysisResult.substring(0, 200) + '...');

    // Enhanced JSON parsing
    let parsedResult;
    try {
      let cleanContent = analysisResult.trim();
      
      // Remove markdown code blocks
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      parsedResult = JSON.parse(cleanContent);
      
      // Validate result structure
      if (!parsedResult.foods || !Array.isArray(parsedResult.foods) || parsedResult.foods.length === 0) {
        throw new Error('Estrutura de resposta inválida');
      }
      
      // Mark as real analysis
      parsedResult.timestamp = new Date().toISOString();
      parsedResult.analysisType = 'openai_real';
      parsedResult.isAnalysisUnavailable = false;
      
      console.log('✅ Análise real da OpenAI concluída com sucesso!');
      
    } catch (parseError) {
      console.error('❌ Erro no parse da resposta OpenAI:', parseError);
      console.log('Conteúdo que falhou:', analysisResult);
      throw new Error('Erro ao processar resposta da OpenAI');
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro na análise:', error);
    
    // Enhanced quota error handling
    if (isQuotaError(error)) {
      console.log('💳 Quota da OpenAI excedida, usando análise mock aprimorada...');
      
      const enhancedMockResult = generateEnhancedMockAnalysis();
      enhancedMockResult.quotaExceeded = true;
      enhancedMockResult.errorMessage = 'Quota da OpenAI temporariamente excedida';
      
      return new Response(JSON.stringify(enhancedMockResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // Generic error fallback
    console.log('🔄 Usando análise mock por erro genérico...');
    const fallbackResult = generateEnhancedMockAnalysis();
    fallbackResult.errorType = 'generic_error';
    fallbackResult.errorMessage = error.message || 'Erro desconhecido na análise';
    
    return new Response(JSON.stringify(fallbackResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});
