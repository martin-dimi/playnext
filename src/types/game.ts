import type { games, playlists } from "~/server/db/schema";

export type Game = typeof games.$inferSelect & {
  playlistIds?: number[];
};
export type Playlist = typeof playlists.$inferSelect;
