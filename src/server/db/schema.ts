import { sql } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rating: numeric("rating"),
  coverUrl: text("cover_url").notNull(),
  psnIds: text("psn_ids")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  steamIds: text("steam_ids")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const playlists = pgTable("playlists", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const playlistGames = pgTable(
  "playlist_games",
  {
    playlistId: integer("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.playlistId, t.gameId] }),
    };
  },
);

export const userGames = pgTable(
  "user_games",
  {
    userId: text("user_id").notNull(),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),

    externalId: text("external_id").notNull(),
    lastPlayed: timestamp("last_played", { withTimezone: true }),
    playtime: integer("playtime"),

    platform: text("platform").notNull(),
    status: text("status").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.userId, t.gameId] }),
    };
  },
);

export const steamProfiles = pgTable("steam_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  avatar: text("avatar").notNull(),
  username: text("username").notNull(),
  realname: text("realname").notNull(),
  profileUrl: text("profile_url").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  synchedAt: timestamp("synched_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
