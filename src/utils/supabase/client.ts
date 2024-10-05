import { env } from "@/env";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import type { SupabaseClient } from "@type/supabase";

export function createClient(): SupabaseClient {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
