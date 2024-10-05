import type { SupabaseClient as Client } from "@supabase/supabase-js";
import type { Database } from "@/utils/supabase/database.types";

// I want to export the type of the Client class using Database as the generic
export type SupabaseClient = Client<Database>;
