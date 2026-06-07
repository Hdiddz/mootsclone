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

const getActiveStorage = () => (getSupabaseRememberMe() ? window.localStorage : window.sessionStorage);
const getInactiveStorage = () => (getSupabaseRememberMe() ? window.sessionStorage : window.localStorage);

const supabaseStorage = {
  getItem(key: string) {
    if (!canUseBrowserStorage()) {
      return null;
    }

    const activeValue = getActiveStorage().getItem(key);
    if (activeValue) {
      return activeValue;
    }

    const hasExplicitPreference = window.localStorage.getItem(rememberMeKey) !== null;
    return hasExplicitPreference ? null : window.sessionStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (!canUseBrowserStorage()) {
      return;
    }

    getActiveStorage().setItem(key, value);
    getInactiveStorage().removeItem(key);
  },
  removeItem(key: string) {
    if (!canUseBrowserStorage()) {
      return;
    }

    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
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
