"use server";

import { type Game } from "@/types/game";
import { createClient, type ImdbClient } from "@/utils/igdb/server";
import { createClient as createSBClient } from "@/utils/supabase/server";
import { fetchIgdbGames, saveGames } from "./create";

export const migratePopularGames = async (): Promise<Game[]> => {
  const supabaseClient = createSBClient();
  const imdbClient = createClient();

  const limit = 500;

  let topGames: Game[] = [];
  let topGamesIds: number[] = [];

  try {
    topGamesIds = await fetchTopPlayedGamesToday(imdbClient, limit);
  } catch (error) {
    throw new Error(
      "Failed to fetch played games: " + (error as Error).message,
    );
  }

  try {
    const games = await fetchIgdbGames(
      imdbClient,
      `id = (${topGamesIds.join(",")})`,
    );

    const gameIdToGame = games.reduce(
      (acc, game) => {
        acc[game.id] = game;
        return acc;
      },
      {} as Record<number, Game>,
    );

    topGames = topGamesIds.map((id, index) => ({
      ...gameIdToGame[id],
      rating: index,
    })) as Game[];
  } catch (error) {
    throw new Error("Failed to fetch games: " + (error as Error).message);
  }

  if (topGames.length <= 0) {
    return [];
  }

  return saveGames(supabaseClient, topGames);
};

const fetchTopPlayedGamesToday = async (
  imdbClient: ImdbClient,
  number: number,
): Promise<number[]> => {
  const response = await imdbClient
    .fields(["game_id"])
    .where(`popularity_type = 1`) // Visits
    .sort("value", "desc")
    .limit(number)
    .request("/popularity_primitives");

  return response?.data.map((game: { game_id: number }) => game.game_id);
};
