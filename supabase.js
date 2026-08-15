import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://dnlvoubafquotxcnqkhi.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fyiPBavDsU-Aax49r5Xi4g_9eg67WnA";
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
