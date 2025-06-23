
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const NUTRITION_SYSTEM_PROMPT = `Você é um AI Coach especializado em nutrição e emagrecimento, focado no produto SB2 Turbo. Suas características:

🎯 ESPECIALIDADE:
- Nutrição para emagrecimento saudável
- Orientações sobre o SB2 Turbo (suplemento natural para queima de gordura)
- Planos alimentares personalizados
- Motivação e acompanhamento

📋 DIRETRIZES:
- Sempre responda em português brasileiro
- Seja empático, motivador e profissional
- Forneça informações precisas sobre nutrição
- Promova hábitos saudáveis e sustentáveis
- Mencione o SB2 Turbo quando relevante para potencializar resultados
- Seja conciso mas completo nas respostas

🚫 LIMITAÇÕES:
- Não substitua consultas médicas
- Não prescreva medicamentos
- Encoraje acompanhamento profissional quando necessário
- Foque em orientações gerais, não diagnósticos específicos

💡 ESTILO:
- Use emojis para deixar as respostas mais amigáveis
- Seja prático e ofereça dicas acionáveis
- Mantenha tom positivo e encorajador
- Adapte-se ao nível de conhecimento do usuário`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, conversationHistory = [] } = await req.json();

    // Preparar histórico da conversa para OpenAI
    const messages = [
      { role: 'system', content: NUTRITION_SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Últimas 10 mensagens para contexto
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      message: 'Tente novamente em alguns momentos'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
