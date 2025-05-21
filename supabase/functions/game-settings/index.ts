
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  try {
    // Parse request body
    const { action, key, value } = await req.json()

    switch (action) {
      case 'get':
        const { data: getData, error: getError } = await supabase
          .rpc('get_game_setting', { setting_key: key })

        if (getError) throw getError

        return new Response(JSON.stringify({ data: getData, success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })

      case 'set':
        const { data: setData, error: setError } = await supabase
          .rpc('save_game_setting', { setting_key: key, setting_value: value })

        if (setError) throw setError

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
