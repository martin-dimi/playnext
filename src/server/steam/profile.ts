import { env } from "@/env";
import { SteamProfile } from "@/types/game";
import { eq } from "drizzle-orm";
import { conflictUpdateAllExcept, db } from "../db";
import { steamProfiles } from "../db/schema";

export async function getSteamProfile(userId: string) {
  const res = await db
    .select()
    .from(steamProfiles)
    .where(eq(steamProfiles.userId, userId));

  return res[0] || null;
}

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

export async function syncSteamProfile(
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

  const inserted = await db
    .insert(steamProfiles)
    .values([
      {
        id: p.steamid,
        userId: userId, // This is the user id from the session
        avatar: p.avatarfull ?? p.avatar,
        username: p.personaname,
        realname: p.realname,
        profileUrl: p.profileurl,
      },
    ])
    .onConflictDoUpdate({
      target: steamProfiles.id,
      set: conflictUpdateAllExcept(steamProfiles, []),
    })
    .returning();

  const profile = inserted[0];

  return profile || null;
}
