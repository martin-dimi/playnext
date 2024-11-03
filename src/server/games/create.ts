"use server";

import { DbGame, Platform, ToGame, type Game } from "@/types/game";
import { createClient, type ImdbClient } from "@/utils/igdb/server";
import { createClient as createSBClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export const getGamesFromSteamIds = async (
  steamGameIds: string[],
): Promise<Game[] | null> => {
  if (steamGameIds.length === 0) {
    return null;
  }

  const supabaseClient = createSBClient();
  const imdbClient = createClient();

  const games = await fetchIgdbGames(
    imdbClient,
    `external_games.category=1 & external_games.uid=(${steamGameIds.join(",")})`,
  );

  console.log(`Fetched ${games.length} games from IGDB`);
  if (games.length != steamGameIds.length) {
    console.warn(
      `Failed to fetch all games from IGDB. Expected ${steamGameIds.length} but got ${games.length}`,
    );
  }

  const savedGames = await saveGames(supabaseClient, games);
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

export const fetchIgdbGames = async (
  imdbClient: ImdbClient,
  where: string,
): Promise<Game[]> => {
  const pageSize = 500;
  let offset = 0;
  let allGames: Game[] = [];

  while (true) {
    const response = await imdbClient
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
      .request("/games");

    const games: Game[] = response.data.map(apiGameToGame);

    allGames = allGames.concat(games);

    if (games.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return allGames;
};

const apiGameToGame = (
  apiGame: ApiGame,
): Omit<Game, "createdAt" | "updatedAt"> => {
  const steamIds =
    apiGame.external_games?.filter((g) => g.category === 1).map((g) => g.uid) ??
    null;

  const psnIds =
    apiGame.external_games
      ?.filter((g) => g.category === 36)
      .map((g) => g.uid) ?? null;

  console.log("Steam ids", apiGame.external_games);

  const platforms: Platform[] = [];
  if (steamIds && steamIds.length > 0) {
    platforms.push("steam");
  }
  if (psnIds && psnIds.length > 0) {
    platforms.push("psn");
  }

  return {
    id: apiGame.id,
    name: apiGame.name,
    description: apiGame.summary || "",
    rating: apiGame.rating,
    coverUrl: apiGame.cover?.url || "",

    platforms: platforms,
    steamIds: steamIds,
    psnIds: psnIds,
  };
};

export const saveGames = async (
  supabaseClient: SupabaseClient,
  games: Game[],
): Promise<Game[]> => {
  const dbGames = games.map(ToDbGame);

  // Make it so on conflict, do nothing
  const res = await supabaseClient
    .from("games")
    .upsert(dbGames, { defaultToNull: false })
    .select()
    .returns<DbGame[]>();
  if (res.error != null) {
    throw new Error("Failed to save games: " + res.error.message);
  }

  return res.data.map(ToGame);
};

const ToDbGame = (game: Game): DbGame => {
  return {
    id: game.id,
    name: game.name,
    description: game.description,
    rating: game.rating,
    coverUrl: game.coverUrl,

    platforms: game.platforms,
    steamId: game.steamIds,
    psnId: game.psnIds,

    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  };
};
