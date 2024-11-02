import { migratePopularGames } from "@/server/games/migrate";

export async function GET() {
  try {
    const games = await migratePopularGames();
    return Response.json(games);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
