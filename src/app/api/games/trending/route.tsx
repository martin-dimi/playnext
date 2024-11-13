import { migrateTrendingGames } from "@/server/games/trending";

export async function GET() {
  try {
    const games = await migrateTrendingGames();
    return Response.json(games);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
