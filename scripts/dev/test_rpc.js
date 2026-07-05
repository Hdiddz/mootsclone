import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://zifoicgtyqnyxwtcnouj.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable__aR4_38yat2abJP4Qsgbrg_pFS55jbb";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: newGroupId, error: rpcError } = await supabase
    .rpc("create_group_with_members", {
      p_title: "Test Group",
      p_created_by: "00000000-0000-0000-0000-000000000000",
      p_member_ids: ["00000000-0000-0000-0000-000000000000"]
    });
    
  console.log("RPC Result:", newGroupId);
  console.log("RPC Error:", rpcError);
}

test();
