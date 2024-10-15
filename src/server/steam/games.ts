import { env } from "@/env";
import type { SupabaseClient } from "@type/supabase";

interface SteamGame {
  appid: number;
  name: string;
  img_icon_url?: string;
  playtime_forever?: number;
  rtime_last_played?: number;
}

export const syncGames = async (
  supabase: SupabaseClient,
  steamId: string,
): Promise<SteamGame[]> => {
  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamid", steamId);
  url.searchParams.append("include_appinfo", "true");
  url.searchParams.append("include_played_free_games", "true");

  const res = await fetch(url.toString());

  const data = (await res.json()) as { response?: { games: SteamGame[] } };
  if (data?.response?.games === null || data?.response?.games === undefined) {
    throw new Error("Steam game response is garbled: " + JSON.stringify(data));
  }

  if (games.length === 0) {
    console.log("No steam games found");
    return [];
  }

  const inserted = await supabase.from("steam_games").upsert(games).select();
  return inserted.data ?? [];
};

export const getGamesFromSteam = async (
  supabase: SupabaseClient,
  steamId: string,
): Promise<SteamGame[]> => {};
