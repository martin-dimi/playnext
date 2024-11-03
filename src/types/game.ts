import { Tables } from "@/utils/supabase/database.types";

// General game interface, shared between users
export interface Game {
  id: number;
  name: string;
  description: string;
  rating: number;
  coverUrl: string;
  platforms: Platform[];
  psnIds: string[] | null;
  steamIds: string[] | null;

  userGames?: UserGame[];

  createdAt: string;
  updatedAt: string;
}

// User specific game interface
export interface UserGame {
  gameId: number;
  userId: string;
  externalId: string;
  platform: Platform;
  status: PlayStatus;
  playTime: number | null; // in seconds
  lastPlayed: string | null; // unix timestamp
}

export type Platform =
  | "steam"
  | "gog"
  | "psn"
  | "epic_games"
  | "xbox"
  | "unknown";
export type PlayStatus = "not_played" | "played" | "done";

export type DbGame = Tables<"games">;
export type DbUserGame = Tables<"user_games">;

export const ToGame = (dbGame: DbGame): Game => {
  return {
    id: dbGame.id,
    name: dbGame.name,
    description: dbGame.description,
    rating: dbGame.rating,
    coverUrl: dbGame.coverUrl,

    platforms: dbGame.platforms as Platform[],
    steamIds: dbGame.steamId,
    psnIds: dbGame.psnId,

    createdAt: dbGame.createdAt,
    updatedAt: dbGame.updatedAt,
  };
};

export const ToUserGame = (dbGame: DbUserGame): UserGame => {
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
