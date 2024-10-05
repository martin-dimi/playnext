import { env } from "@/env";
import type { SteamGame } from "@type/steam";
import type { SupabaseClient } from "@type/supabase";

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

  const games: SteamGame[] = data.response.games.map((g) => ({
    appid: g.appid,
    name: g.name,
    img_icon_url: g.img_icon_url,
    playtime_forever: g.playtime_forever,
    rtime_last_played: g.rtime_last_played,
    userid: g.userid,
  }));

  if (games.length === 0) {
    console.log("No steam games found");
    return [];
  }

  const inserted = await supabase.from("steam_games").upsert(games).select();
  return inserted.data ?? [];
};
