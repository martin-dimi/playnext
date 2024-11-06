import type { DbUserGame, Platform, PlayStatus, UserGame } from "@/types/game";
import { createClient } from "@/utils/supabase/server";
import { uniqBy } from "lodash";

export const saveUserGames = async (
  userGames: UserGame[],
  options: { userId?: string } = {},
): Promise<UserGame[]> => {
  const supabaseClient = createClient();
  const dbUserGames = userGames.map(ToDbUserGame);

  if (options.userId) {
    dbUserGames.forEach((game) => {
      // @ts-ignore
      game.userId = options.userId;
    });
  }

  // remove games with the same gameId. using lodash
  const uniqueGames = uniqBy(dbUserGames, "gameId");

  // Make it so on conflict, do nothing
  const res = await supabaseClient
    .from("user_games")
    .upsert(uniqueGames, { defaultToNull: false })
    .select();
  if (res.error != null) {
    throw new Error("Failed to save userGames games: " + res.error.message);
  }

  return res.data.map(ToUserGame);
};

const ToDbUserGame = (
  game: UserGame,
): Omit<DbUserGame, "createdAt" | "updatedAt" | "userId"> => {
  return {
    gameId: game.gameId,
    externalId: game.externalId,
    platform: game.platform,
    status: game.status,
    playTime: game.playTime,
    lastPlayed: game.lastPlayed,
  };
};

const ToUserGame = (dbGame: DbUserGame): UserGame => {
  return {
    gameId: dbGame.gameId,
    userId: dbGame.userId,
    externalId: dbGame.externalId,
    platform: dbGame.platform as Platform,
    status: dbGame.status as PlayStatus,
    playTime: dbGame.playTime,
    lastPlayed: dbGame.lastPlayed,
  };
};
