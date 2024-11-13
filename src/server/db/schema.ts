import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rating: integer("rating").notNull(),
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
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  userId: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});

export const playlistGames = pgTable(
  "playlist_games",
  {
    playlistId: integer("playlist_id")
      .notNull()
      .references(() => playlists.id),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id),
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

// export const booksToAuthors = pgTable("books_to_authors", {
//   authorId: integer("author_id"),
//   bookId: integer("book_id"),
// }, (table) => {
//   return {
//     pk: primaryKey({ columns: [table.bookId, table.authorId] }),
//     pkWithCustomName: primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] }),
//   };
// });

export const userGames = pgTable(
  "user_games",
  {
    userId: text().notNull(),
    gameId: integer()
      .notNull()
      .references(() => games.id),

    externalId: text().notNull(),
    lastPlayed: timestamp({ withTimezone: true }),
    playtime: integer(),

    platform: text().notNull(),
    status: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.userId, t.gameId] }),
    },
  ],
);
