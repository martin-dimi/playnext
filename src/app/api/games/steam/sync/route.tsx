import { syncSteamGames } from "@/server/steam/games";

export async function GET() {
  const steamId = "76561197980685581";
  const userId = "00072d9a-8424-4325-930a-42fcda91daa3";

  try {
    const games = await syncSteamGames(steamId, { userId: userId });
    return Response.json(games);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
