import { Game, ToGame } from "@/types/game";
import { createClient } from "@/utils/supabase/server";
import Home from "./home";

export default async function Trending({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { game: gameId } = await searchParams;
  const games = await getTrengingGames();

  return (
    <section className="w-full flex gap-5 justify-start relative overflow-hidden">
      <Home games={games} />
    </section>
  );
}

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
