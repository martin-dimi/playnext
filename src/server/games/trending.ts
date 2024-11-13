"use server";

import type { Game } from "~/types/game";
import { fetchIgdbGames, saveGames } from "./create";
import { createClient, type ImdbClient } from "./igdb";

export const migrateTrendingGames = async (): Promise<Game[]> => {
  console.log("Migrating trending games");
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
  console.log(`Fetched ${topGamesIds.length} top played games`);

  try {
    const games = await fetchIgdbGames(`id = (${topGamesIds.join(",")})`);

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

  console.log(`Fetched ${topGames.length} games`);

  if (topGames.length <= 0) {
    return [];
  }

  try {
    return saveGames(topGames);
  } catch (error) {
    throw new Error("Failed to save games: " + (error as Error).message);
  } finally {
    console.log("Finished migrating trending games");
  }
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

  return response?.data.map(
    (game: { game_id: number }) => game.game_id,
  ) as number[];
};
