import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zifoicgtyqnyxwtcnouj.supabase.co";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable__aR4_38yat2abJP4Qsgbrg_pFS55jbb";
const rememberMeKey = "moots.auth.remember";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

const canUseBrowserStorage = () => typeof window !== "undefined";

export const getSupabaseRememberMe = () => {
  if (!canUseBrowserStorage()) {
    return true;
  }

  return window.localStorage.getItem(rememberMeKey) !== "false";
};

export const setSupabaseRememberMe = (remember: boolean) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(rememberMeKey, remember ? "true" : "false");
};

// Per-tab auth sessions.
//
// The Supabase session lives in sessionStorage, which is unique to each tab and
// is NOT shared between tabs (and its changes don't fire cross-tab `storage`
// events). That means you can sign in as a different account in every tab of
// the same browser — handy for testing, and harmless in production.
//
// To still keep users "logged in" across reloads / new tabs / browser restarts,
// we mirror the session into localStorage under a DIFFERENT (prefixed) key — a
// "seed". A freshly opened tab with no session restores itself from the seed.
// Because the seed uses its own key, writing it never triggers Supabase's
// cross-tab sync on the real key, so tabs stay independent. The seed is only
// written when "remember me" is on.
const seedKey = (key: string) => `moots.seed::${key}`;

const supabaseStorage = {
  getItem(key: string) {
    if (!canUseBrowserStorage()) {
      return null;
    }

    // 1) This tab's own session.
    const fromSession = window.sessionStorage.getItem(key);
    if (fromSession !== null) {
      return fromSession;
    }

    // 2) Restore a fresh tab from the persisted seed (stay-logged-in).
    const seed = window.localStorage.getItem(seedKey(key));
    if (seed !== null) {
      window.sessionStorage.setItem(key, seed);
      return seed;
    }

    // 3) One-time migration of legacy sessions stored under the real key.
    const legacy = window.localStorage.getItem(key);
    if (legacy !== null) {
      window.sessionStorage.setItem(key, legacy);
      if (getSupabaseRememberMe()) {
        window.localStorage.setItem(seedKey(key), legacy);
      }
      return legacy;
    }

    return null;
  },
  setItem(key: string, value: string) {
    if (!canUseBrowserStorage()) {
      return;
    }

    window.sessionStorage.setItem(key, value);
    if (getSupabaseRememberMe()) {
      window.localStorage.setItem(seedKey(key), value);
    } else {
      window.localStorage.removeItem(seedKey(key));
    }
    // Never keep the real key in localStorage — that's what causes tabs to share
    // a session and sync sign-in/out across each other.
    window.localStorage.removeItem(key);
  },
  removeItem(key: string) {
    if (!canUseBrowserStorage()) {
      return;
    }

    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(seedKey(key));
    window.localStorage.removeItem(key);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
