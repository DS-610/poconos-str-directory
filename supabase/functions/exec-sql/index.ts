import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { sql } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to create exec_sql function first
    const createFn = `
      CREATE OR REPLACE FUNCTION exec_sql(sql TEXT) RETURNS VOID AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Use raw SQL via the REST API to create the function
    const { error: createErr } = await supabase.rpc("exec_sql", { sql: createFn }).then(
      (r) => r,
      () => ({ error: { message: "Function doesn't exist yet" } })
    );
    
    // Now execute the actual SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
