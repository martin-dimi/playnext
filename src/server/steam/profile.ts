import { env } from "@/env";
import { SteamProfile } from "@/types/steam";
import { SupabaseClient } from "@/types/supabase";

export interface SteamPlayerResponse {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarfull?: string;
  lastlogoff: number;
  personastate: number;
  realname: string;
  userid: string;
}

export async function syncProfile(
  supabase: SupabaseClient,
  userId: string,
  steamId: string,
): Promise<SteamProfile | null> {
  const url = new URL(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamids", steamId);

  const res = await fetch(url.toString());

  const data = (await res.json()) as {
    response?: { players: SteamPlayerResponse[] };
  };
  const p = data?.response?.players[0];
  if (!p) {
    return null;
  }

  const insert = await supabase
    .from("profiles_steam")
    .upsert({
      id: p.steamid,
      userId: userId,
      profilestate: p.profilestate,
      username: p.personaname,
      realname: p.realname,
      profileUrl: p.profileurl,
      avatar: p.avatarfull ?? p.avatar,
      personastate: p.personastate,
    } as SteamProfile)
    .select();

  if (insert.error) {
    throw new Error("Failed to insert profile: " + insert.error.message);
  }

  if (insert.data.length != 1) {
    throw new Error("Failed to insert profile: " + insert.data);
  }

  return insert.data[0] || null;
}
