import { ToUserGame, type DbUserGame, type UserGame } from "@/types/game";
import { createClient } from "@/utils/supabase/server";

export const saveUserGames = async (
  userGames: UserGame[],
): Promise<UserGame[]> => {
  const supabaseClient = createClient();
  const dbUserGames = userGames.map(ToDbUserGame);

  // Make it so on conflict, do nothing
  const res = await supabaseClient
    .from("user_games")
    .upsert(dbUserGames, { defaultToNull: false })
    .select();
  if (res.error != null) {
    throw new Error("Failed to save games: " + res.error.message);
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
