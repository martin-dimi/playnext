import { env } from "@/env";
import type { SteamProfile } from "@/types/steam";
import type { SupabaseClient } from "@/types/supabase";

type SteamProfileResponse = SteamProfile & {
  avatarfull?: string;
};

export const syncProfile = async (
  supabase: SupabaseClient,
  userId: string,
  steamId: string,
): Promise<SteamProfile> => {
  const url = new URL(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamids", steamId);

  const res = await fetch(url.toString());

  const data = (await res.json()) as {
    response?: { players: SteamProfileResponse[] };
  };
  const p = data?.response?.players[0];
  if (!p) {
    throw new Error("Steam profile not found");
  }

  const profile: SteamProfile = {
    steamid: p.steamid,
    communityvisibilitystate: p.communityvisibilitystate,
    profilestate: p.profilestate,
    personaname: p.personaname,
    profileurl: p.profileurl,
    avatar: p.avatarfull ?? p.avatar,
    lastlogoff: p.lastlogoff,
    personastate: p.personastate,
    realname: p.realname,
    userid: userId,
  };

  const inserted = await supabase
    .from("steam_profiles")
    .upsert(profile)
    .select()
    .single();

  if (inserted.error != null) {
    throw new Error("Steam profile upsert failed: " + inserted.error.message);
  }

  return inserted.data;
};
