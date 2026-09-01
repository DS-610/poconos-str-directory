const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const env = fs.readFileSync("/root/Easton/.env.local", "utf-8");
let url, key;
for (const l of env.split("\n")) {
  const t = l.trim();
  if (t.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) url = t.slice(t.indexOf("=")+1);
  if (t.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) key = t.slice(t.indexOf("=")+1);
}

const supabase = createClient(url, key);

async function main() {
  console.log("Connecting to:", url.slice(0, 40));
  
  // First, create the exec_sql function via the REST API
  const createSql = "CREATE OR REPLACE FUNCTION exec_sql(sql TEXT) RETURNS SETOF json AS $$ BEGIN RETURN QUERY EXECUTE sql; END; $$ LANGUAGE plpgsql SECURITY DEFINER;";
  
  // Try to invoke exec_sql (won't work if function doesn't exist)
  try {
    const { error } = await supabase.from("providers").select("id").limit(0);
    console.log("Table check:", error ? "ERROR: " + error.message : "OK");
  } catch (e) {
    console.log("Query error:", e.message);
  }

  // List what columns currently exist via a simple select
  const { data } = await fetch(url + "/rest/v1/providers?select=*&limit=1", {
    headers: { apikey: key, Authorization: "Bearer " + key }
  }).then(r => r.json()).catch(() => null);
  
  console.log("Current providers columns:", data && data[0] ? Object.keys(data[0] || {}).join(", ") : "(empty)");
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
