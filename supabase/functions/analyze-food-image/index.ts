
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando análise de imagem com OpenAI Vision API');
    
    const { imageData } = await req.json();

    if (!imageData) {
      throw new Error('Dados da imagem não fornecidos');
    }

    if (!openAIApiKey) {
      throw new Error('Chave da OpenAI API não configurada');
    }

    // Prompt otimizado para alimentos brasileiros
    const systemPrompt = `Você é um especialista em nutrição e análise de alimentos brasileiros. Analise a imagem fornecida e identifique todos os alimentos visíveis.

Para cada alimento identificado, forneça:
1. Nome do alimento (em português brasileiro)
2. Quantidade estimada (em gramas, colheres, xícaras, etc.)
3. Calorias estimadas
4. Nível de confiança da identificação (0.0 a 1.0)

Também calcule:
- Total de calorias da refeição
- Macronutrientes (proteína, carboidratos, gordura, fibra) em gramas
- 2-3 recomendações nutricionais específicas

Seja preciso nas estimativas de porção baseando-se em referências visuais como pratos, utensílios ou comparações com objetos comuns.

Responda APENAS em formato JSON válido seguindo esta estrutura:
{
  "foods": [
    {
      "name": "Nome do alimento",
      "quantity": "quantidade estimada",
      "calories": número_de_calorias,
      "confidence": 0.0_a_1.0
    }
  ],
  "totalCalories": número_total,
  "macros": {
    "protein": gramas_proteína,
    "carbs": gramas_carboidratos,
    "fat": gramas_gordura,
    "fiber": gramas_fibra
  },
  "recommendations": [
    "recomendação 1",
    "recomendação 2"
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem de alimento e forneça as informações nutricionais detalhadas:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da OpenAI API:', errorData);
      throw new Error(`Erro da OpenAI API: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Resposta bruta da OpenAI:', content);

    // Parse da resposta JSON - remover markdown se presente
    let analysisResult;
    try {
      // Remover markdown code blocks se presentes
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      analysisResult = JSON.parse(cleanContent);
      console.log('✅ Parse JSON realizado com sucesso:', analysisResult);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse da resposta:', parseError);
      console.error('Conteúdo que falhou no parse:', content);
      
      // Fallback para dados mock em caso de erro de parse
      analysisResult = {
        foods: [
          {
            name: "Alimento não identificado",
            quantity: "Porção estimada",
            calories: 200,
            confidence: 0.5
          }
        ],
        totalCalories: 200,
        macros: {
          protein: 15,
          carbs: 25,
          fat: 8,
          fiber: 3
        },
        recommendations: [
          "Não foi possível analisar a imagem completamente. Tente uma foto mais clara.",
          "Certifique-se de que os alimentos estejam bem iluminados e visíveis."
        ]
      };
    }

    // Adicionar timestamp
    analysisResult.timestamp = new Date().toISOString();

    console.log('✅ Análise concluída com sucesso:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro na análise de alimentos:', error);
    
    // Retornar dados mock em caso de erro para não quebrar a funcionalidade
    const fallbackResult = {
      foods: [
        {
          name: "Alimento (análise indisponível)",
          quantity: "Porção estimada",
          calories: 250,
          confidence: 0.3
        }
      ],
      totalCalories: 250,
      macros: {
        protein: 20,
        carbs: 30,
        fat: 10,
        fiber: 5
      },
      recommendations: [
        "Serviço de análise temporariamente indisponível.",
        "Os valores mostrados são estimativas. Tente novamente mais tarde."
      ],
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Retorna 200 para não quebrar o frontend
    });
  }
});
