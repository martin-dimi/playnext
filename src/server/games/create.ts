"use server";

import type { Game } from "@/types/game";
import { createClient } from "@/utils/igdb/server";
import { createClient as createSBClient } from "@/utils/supabase/server";

export const getGameBySteamId = async (): Promise<Game | null> => {
  const supabaseClient = createSBClient();
  const imdbClient = createClient();

  // Step 1: Check if we have the game in our DB.

  // Step 2: If we don't have it, get the game from IGDB and add it to our DB.

  return null;
};
