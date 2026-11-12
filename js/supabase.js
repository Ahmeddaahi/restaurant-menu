/**
 * Supabase Client Initialization
 */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ezfcqeavtbbigakszruk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_oIbZPQzDmTm2yRe7DRWXqg_ofoijtu3";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
