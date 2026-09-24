const PLACEHOLDER_URL = "https://your-project-ref.supabase.co";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// False until real project credentials replace the .env.local.example placeholders.
export const isSupabaseConfigured =
  supabaseUrl !== "" &&
  supabaseUrl !== PLACEHOLDER_URL &&
  supabaseAnonKey !== "" &&
  supabaseAnonKey !== "your-anon-key";
