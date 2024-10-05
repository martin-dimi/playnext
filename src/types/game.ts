// General game interface, shared between users
export interface Game {
  id: string;
  name: string;
  coverUrl: string;
  availablePlatforms: Platform[];
}

// User specific game interface
export interface UserGame extends Game {
  platform: Platform;
  status: PlayStatus;
  playTime?: number; // in seconds
  lastPlayed?: number; // unix timestamp
}

export type Platform = "steam" | "psn" | "epic_games";
export type PlayStatus = "not_played" | "played" | "done" | "beaten";
