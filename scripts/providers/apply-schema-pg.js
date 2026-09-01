const { Client } = require("pg");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf-8");
let url, key;
for (const line of env.split("\n")) {
  const t = line.trim();
  if (t.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) url = t.split("=")[1];
  if (t.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) key = t.split("=")[1];
}

const jwt = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString());
const projectRef = jwt.ref;

const client = new Client({
  host: "db." + projectRef + ".supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: key,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Supabase DB!");
    const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'providers' ORDER BY ordinal_position");
    const colNames = cols.rows.map(r => r.column_name);
    console.log("Current providers columns:", colNames.length > 0 ? colNames.join(", ") : "(table empty/missing)");
    const schema = fs.readFileSync("supabase/schema.sql", "utf-8");
    await client.query(schema);
    console.log("Schema applied!");
    const cols2 = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'providers' ORDER BY ordinal_position");
    console.log("Updated columns:", cols2.rows.map(r => r.column_name).join(", "));
    await client.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
