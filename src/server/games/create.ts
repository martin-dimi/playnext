"use server";

import type { Game } from "~/types/game";
import { createClient } from "./igdb";
import { db } from "../db";
import { games as gamesSchema } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export const getGamesFromSteamIds = async (
  steamGameIds: string[],
): Promise<Game[] | null> => {
  if (steamGameIds.length === 0) {
    console.log("No steam games to fetch");
    return null;
  }

  const games = await fetchIgdbGames(
    `external_games.category=1 & external_games.uid=(${steamGameIds.join(",")})`,
  );

  console.log(`Fetched ${games.length} games from IGDB`);
  if (games.length != steamGameIds.length) {
    console.warn(
      `Failed to fetch all games from IGDB. Expected ${steamGameIds.length} but got ${games.length}`,
    );
  }

  const savedGames = await saveGames(games);
  console.log(`Saved ${savedGames.length} games to Supabase`);

  return savedGames;
};

interface ApiGame {
  id: number;
  name: string;
  summary: string;
  rating: number;
  cover?: { url: string };
  external_games?: { url: string; category: number; uid: string }[];
}

export const fetchIgdbGames = async (where: string): Promise<Game[]> => {
  const imdbClient = createClient();
  const pageSize = 500;
  let offset = 0;
  let allGames: Omit<Game, "createdAt" | "updatedAt">[] = [];

  while (true) {
    const response = (await imdbClient
      .fields([
        "id",
        "name",
        "cover.url",
        "external_games.category",
        "external_games.uid",
        "summary",
        "rating",
      ])
      .where(where)
      .limit(pageSize)
      .offset(offset)
      .request("/games")) as { data: ApiGame[] };

    const games = response.data.map(apiGameToGame);

    allGames = allGames.concat(games);

    if (games.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return allGames as Game[];
};

const apiGameToGame = (
  apiGame: ApiGame,
): Omit<Game, "createdAt" | "updatedAt"> => {
  const steamIds =
    apiGame.external_games?.filter((g) => g.category === 1).map((g) => g.uid) ??
    [];

  const psnIds =
    apiGame.external_games
      ?.filter((g) => g.category === 36)
      .map((g) => g.uid) ?? [];

  return {
    id: apiGame.id,
    name: apiGame.name,
    description: apiGame.summary ?? "",
    rating: apiGame.rating,
    coverUrl: apiGame.cover?.url ?? "",

    steamIds: steamIds,
    psnIds: psnIds,
  };
};

export const saveGames = async (games: Game[]): Promise<Game[]> => {
  const res = await db
    .insert(gamesSchema)
    .values(games)
    .onConflictDoUpdate({
      target: gamesSchema.id,
      set: {
        rating: sql.raw(`excluded.rating`),
      },
    })
    .returning();

  return Array.from(res.values());
};
