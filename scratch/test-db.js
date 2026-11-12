import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const SUPABASE_URL = "https://ezfcqeavtbbigakszruk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_oIbZPQzDmTm2yRe7DRWXqg_ofoijtu3";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .limit(1);
  console.log("Categories row:", data);
  if (error) console.log("Error:", error);
}
run();
