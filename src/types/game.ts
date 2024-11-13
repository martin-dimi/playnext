import type {
  games,
  playlists,
  steamProfiles,
  userGames,
} from "~/server/db/schema";

export type Game = typeof games.$inferSelect & {
  playlistIds?: number[];
};

export type UserGame = typeof userGames.$inferSelect;

export type Playlist = typeof playlists.$inferSelect;

export type SteamProfile = typeof steamProfiles.$inferSelect;
