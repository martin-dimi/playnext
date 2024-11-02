import { Game, ToGame, ToUserGame } from "@/types/game";
import { createClient } from "@/utils/supabase/server";
import { groupBy, map } from "lodash";
import { redirect } from "next/navigation";
import Home from "../trending/home";

export default async function Trending({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { game: gameId } = await searchParams;
  const games = await getOwnedGames();

  return (
    <section className="w-full flex gap-5 justify-start relative overflow-hidden">
      <Home games={games} />
    </section>
  );
}

const getOwnedGames = async (): Promise<Game[]> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user");
    redirect("/error");
  }

  const q = supabase
    .from("user_games")
    .select(`*,games (*)`)
    .eq("userId", user.id) // Filter for the current user's games
    .order("playTime", { ascending: false }) // Order based on playTime in user_games
    .limit(50);

  const res = await q;
  if (res.error != null) {
    throw new Error("Failed to fetch games: " + res.error.message);
  }

  // Group user_games entries by gameId
  const grouped = groupBy(res.data, (ug) => ug.games!!.id);

  // Map grouped results to Game[] format with userGames array for each game
  const games = map(grouped, (userGames, gameId) => ({
    ...ToGame(userGames[0]?.games!!),
    userGames: userGames.map(ToUserGame),
  })).sort((a, b) => b.userGames[0]?.playTime!! - a.userGames[0]?.playTime!!);

  return games;
};
