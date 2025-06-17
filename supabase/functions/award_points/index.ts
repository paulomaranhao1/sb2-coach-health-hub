
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { points, reason, userId } = await req.json()

    // Buscar estatísticas atuais do usuário
    const { data: currentStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const newPoints = (currentStats?.points || 0) + points
    const newLevel = Math.floor(newPoints / 100) + 1

    // Atualizar ou inserir estatísticas
    const { error: upsertError } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        points: newPoints,
        level: newLevel,
        shields: currentStats?.shields || [],
        stickers: currentStats?.stickers || [],
        streak: currentStats?.streak || 0
      })

    if (upsertError) throw upsertError

    return new Response(
      JSON.stringify({ 
        success: true, 
        newPoints, 
        newLevel,
        reason 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
