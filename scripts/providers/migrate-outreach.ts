import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

function loadEnv() {
  const content = fs.readFileSync('.env.local', 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx);
    const value = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = value;
  }
}

loadEnv();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !key) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  console.log('supabase:', url.slice(0, 30));

  const supabase = createClient(url, key);

  const { data, error: checkError } = await supabase
    .from('providers')
    .select('outreach_status, outreach_contacted_at, outreach_notes, outreach_email_count')
    .limit(1);

  if (checkError) {
    console.error('Error:', checkError.message);
    console.log('SQL migration needed - check schema.sql');
    process.exit(1);
  }

  console.log('Columns present:', data !== null);
  console.log('Outreach columns OK in providers table');

  const { count } = await supabase
    .from('providers')
    .select('*', { count: 'exact', head: true });
  console.log('Total providers:', count);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
