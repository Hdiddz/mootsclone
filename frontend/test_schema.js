import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://zifoicgtyqnyxwtcnouj.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable__aR4_38yat2abJP4Qsgbrg_pFS55jbb";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  // Insert a test group directly to see the error
  const { data, error } = await supabase.from('chat_groups').insert([{ title: "test", created_by: "00000000-0000-0000-0000-000000000000" }]);
  console.log("Direct insert error:", error);
}

test();
