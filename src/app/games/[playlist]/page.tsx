import GamesBoard from "@/components/games/gamesBoard";
import { Game, ToGame, ToUserGame } from "@/types/game";
import { createClient } from "@/utils/supabase/server";
import { groupBy, map } from "lodash";
import { redirect } from "next/navigation";
import EmptyGameList from "./emptyList";

export default async function GamesPage({
  params,
  searchParams,
}: {
  params: Promise<{ playlist: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { playlist } = await params;
  const { g: preselectedGameId } = await searchParams;

  const games = await getPlaylistGames(playlist);
  const enableReorder = playlist !== "trending";

  const preselectedGame = preselectedGameId
    ? games.find((g) => g.id === +preselectedGameId)
    : null;

  return (
    <section className="w-full flex gap-5 justify-start relative overflow-hidden">
      {games.length === 0 ? (
        <EmptyGameList playlist={playlist} />
      ) : (
        <GamesBoard
          games={games}
          preselectedGame={preselectedGame ?? null}
          enableReorder={enableReorder}
        />
      )}
    </section>
  );
}

const getPlaylistGames = async (playlist: string): Promise<Game[]> => {
  if (playlist === "trending") {
    return getTrengingGames();
  }
  if (playlist === "all") {
    return getOwnedGames();
  }
  if (playlist === "steam") {
    return getOwnedGames();
  }

  // TODO: add custom playlists..
  return [];
};

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

const getTrengingGames = async (): Promise<Game[]> => {
  const supabaseClient = createClient();

  const res = await supabaseClient
    .from("games")
    .select()
    .order("rating", { ascending: true })
    .limit(50);
  if (res.error != null) {
    throw new Error("Failed to fetch games: " + res.error.message);
  }

  return res.data.map(ToGame);
};
