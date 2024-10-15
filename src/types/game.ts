import { Tables } from "@/utils/supabase/database.types";

// General game interface, shared between users
export interface Game {
  id: number;
  name: string;
  coverUrl: string;
  platforms: Platform[];

  createdAt: string;
  updatedAt: string;
}

// User specific game interface
export interface UserGame extends Game {
  gameId: number;
  userId: string;
  platform: Platform;
  status: PlayStatus;
  playTime?: number; // in seconds
  lastPlayed?: string; // unix timestamp
}

export type Platform = "steam" | "psn" | "epic_games";
export type PlayStatus = "not_played" | "played" | "done" | "beaten";

export type DbGame = Tables<"games">;
export type DbUserGame = Tables<"user_games">;

export const ToGame = (dbGame: DbGame): Game => {
  return {
    id: dbGame.id,
    name: dbGame.name,
    coverUrl: dbGame.coverUrl,
    platforms: dbGame.platforms as Platform[],
    createdAt: dbGame.createdAt,
    updatedAt: dbGame.updatedAt,
  };
};

export const ToUserGame = (
  dbUserGame: DbUserGame,
  dbGame: DbGame,
): UserGame => {
  const game = ToGame(dbGame);

  return {
    ...game,
    gameId: dbUserGame.gameId,
    userId: dbUserGame.userId,
    platform: dbUserGame.platform as Platform,
    status: dbUserGame.status as PlayStatus,
    playTime: dbUserGame.playTime ?? undefined,
    lastPlayed: dbUserGame.lastPlayed ?? undefined,
  };
};
