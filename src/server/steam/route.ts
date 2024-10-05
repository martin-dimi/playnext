import { env } from "@/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { resolveSteamId } from "./auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("No user");
    redirect("/error");
  }

  try {
    const identifier = await resolveSteamId(request);
    await processSteamLogin(supabase, user.id, identifier);
  } catch (error) {
    console.error(error);
    redirect("/error");
  }

  console.log("Got steam auth request", searchParams);
  revalidatePath("/", "layout");
  redirect("/");
}

async function processSteamLogin(
  supabase: SupabaseClient,
  userId: string,
  steamId: string,
) {
  console.log("Process steam identifier", steamId);

  const [profile, games] = await Promise.all([
    getProfile(supabase, userId, steamId),
    getGames(supabase, userId, steamId),
  ]);

  console.log("Got profile", profile);
  console.log("Got games", games?.length);

  return;
}

const getGames = async (
  supabase: SupabaseClient,
  userId: string,
  steamId: string,
) => {
  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamid", steamId);
  url.searchParams.append("include_appinfo", "true");
  url.searchParams.append("include_played_free_games", "true");

  const res = await fetch(url.toString());

  const data = (await res.json()) as { response?: { games: SteamGame[] } };

  if (!data?.response?.games) {
    return null;
  }

  const games: SteamGame[] = data.response.games.map((g) => {
    return {
      appid: g.appid,
      name: g.name,
      img_icon_url: g.img_icon_url,
      playtime_forever: g.playtime_forever,
      rtime_last_played: g.rtime_last_played,
      userid: userId,
    };
  });

  try {
    const x = await supabase.from("steam_games").upsert(games).select();
    console.log("Upserted games", x);
  } catch (error) {
    console.error(error);
    return null;
  }

  return games;
};

export interface SteamGame {
  appid: number;
  name: string;
  img_icon_url: string;

  playtime_forever: number;
  rtime_last_played: number;
  userid: string;
}

const getProfile = async (
  supabase: SupabaseClient,
  userId: string,
  steamId: string,
) => {
  const url = new URL(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamids", steamId);

  const res = await fetch(url.toString());

  const data = (await res.json()) as { response?: { players: SteamProfile[] } };
  const p = data?.response?.players[0];
  if (!p) {
    return null;
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

  const x = await supabase.from("steam_profiles").upsert(profile).select();
  console.log("Upserted profile", x);

  return profile;
};

export interface SteamProfile {
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
