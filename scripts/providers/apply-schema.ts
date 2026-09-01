import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

function loadEnv() {
  const content = fs.readFileSync(".env.local", "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx);
    const value = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = value;
  }
}

loadEnv();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  console.log("Connecting to Supabase:", url.slice(0, 40));
  const supabase = createClient(url, key);

  // First, try checking if providers table exists
  const { data: checkData, error: checkErr } = await supabase
    .from("providers")
    .select("count")
    .limit(1);

  if (checkErr && checkErr.message.includes("schema cache")) {
    console.log("Providers table does not exist yet. Applying schema.sql...");

    const schema = fs.readFileSync("supabase/schema.sql", "utf-8");

    // Try using the Supabase edge function / SQL endpoint
    const sqlRes = await fetch(url + "/rest/v1/", {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: schema }),
    });

    if (!sqlRes.ok) {
      console.error("Schema API failed. Please run supabase/schema.sql manually in SQL Editor.");
      process.exit(1);
    }
  } else if (checkErr) {
    console.error("Error:", checkErr.message);
    process.exit(1);
  }

  // Now check outreach columns
  const { data, error } = await supabase
    .from("providers")
    .select("outreach_status, outreach_contacted_at, outreach_notes, outreach_email_count")
    .limit(1);

  if (error) {
    console.error("Outreach columns missing:", error.message);
    console.log("Please run the ALTER TABLE statements from schema.sql in your SQL Editor.");
    process.exit(1);
  }

  console.log("Outreach columns confirmed in providers table");

  const { count } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true });
  console.log("Total providers in DB:", count);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
