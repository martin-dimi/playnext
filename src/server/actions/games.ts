"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNotNull, max, sql } from "drizzle-orm";
import {
  games as gamesSchema,
  playlistGames as playlistGamesSchema,
  playlists as playlistsSchema,
  userGames as userGamesSchema,
} from "~/server/db/schema";
import { Game, Playlist } from "~/types/game";
import { db } from "../db";

const playlistIdsType = sql<
  number[]
>`array_agg(${playlistGamesSchema.playlistId}) as playlist_ids`;

export async function getOwnedGames(limit: number): Promise<Game[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  const res = await db
    .select({
      game: gamesSchema,
      playlistIds: playlistIdsType,
      playtime: sql`MAX(${userGamesSchema.playtime}) as playtime`,
    })
    .from(userGamesSchema)
    .leftJoin(gamesSchema, eq(userGamesSchema.gameId, gamesSchema.id))
    .leftJoin(
      playlistGamesSchema,
      eq(userGamesSchema.gameId, playlistGamesSchema.gameId),
    )
    .where(and(eq(userGamesSchema.userId, userId), isNotNull(gamesSchema.name)))
    .groupBy(gamesSchema.id)
    .orderBy(desc(sql`playtime`))
    .limit(limit);

  const games =
    res.map((v) => ({
      ...v.game!,
      playlistIds: v.playlistIds ?? [],
    })) ?? [];

  return games;
}

export async function getTrendingGames(limit: number): Promise<Game[]> {
  const res = await db
    .select({
      game: gamesSchema,
      playlistIds: sql<
        number[]
      >`array_agg(${playlistGamesSchema.playlistId}) as playlist_ids`,
    })
    .from(gamesSchema)
    .leftJoin(
      playlistGamesSchema,
      eq(playlistGamesSchema.gameId, gamesSchema.id),
    )
    .groupBy(gamesSchema.id)
    .orderBy(gamesSchema.rating)
    .limit(limit);

  return (
    res.map((v) => ({
      ...v.game,
      playlistIds: v.playlistIds ?? [],
    })) ?? []
  );
}

// FIX: this function ignores userId...
export async function getPlaylistGames(playlistId: number): Promise<Game[]> {
  const res = await db
    .select({
      game: gamesSchema,
      rank: sql`MAX(CASE WHEN ${playlistGamesSchema.playlistId} = ${playlistId} THEN ${playlistGamesSchema.rank} END) as rank`,
      playlistIds: sql<
        number[]
      >`array_agg(${playlistGamesSchema.playlistId}) as playlist_ids`,
    })
    .from(gamesSchema)
    .leftJoin(
      playlistGamesSchema,
      eq(playlistGamesSchema.gameId, gamesSchema.id),
    )
    .groupBy(gamesSchema.id)
    .having(
      sql`ARRAY[${playlistId}::int] <@ array_agg(${playlistGamesSchema.playlistId})`,
    )
    .orderBy(sql`rank`);

  return (
    res
      .filter((v) => v?.game !== null)
      .map(
        (v) =>
          ({
            ...v.game,
            playlistIds: v.playlistIds ?? [],
          }) as Game,
      ) ?? []
  );
}

export const getUserPlaylists = async (): Promise<Playlist[]> => {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const ps = await db.query.playlists.findMany({
    where: eq(playlistsSchema.userId, userId),
    orderBy: (playlist, { asc }) => [asc(playlist.name)],
  });

  return ps ?? [];
};

export async function updatePlaylistGames(
  playlistId: number,
  gameIds: number[],
) {
  const updates = gameIds.map((id, idx) => ({
    playlistId: playlistId,
    gameId: id,
    rank: idx + 1,
  }));

  await db
    .insert(playlistGamesSchema)
    .values(updates)
    .onConflictDoUpdate({
      target: [playlistGamesSchema.playlistId, playlistGamesSchema.gameId],
      set: {
        rank: sql.raw(`excluded.rank`),
      },
    });
}

export async function removeGameFromPlaylist(
  playlistId: number,
  gameId: number,
) {
  await db
    .delete(playlistGamesSchema)
    .where(
      and(
        eq(playlistGamesSchema.playlistId, playlistId),
        eq(playlistGamesSchema.gameId, gameId),
      ),
    );
}

export async function addGameToPlaylist(playlistId: number, gameId: number) {
  const q1 = await db
    .select({ value: max(playlistGamesSchema.rank) })
    .from(playlistGamesSchema)
    .where(eq(playlistGamesSchema.playlistId, playlistId));
  const maxRank = q1[0]?.value ?? 0;

  const res = await db
    .insert(playlistGamesSchema)
    .values({
      gameId: gameId,
      playlistId: playlistId,
      rank: maxRank + 1,
    })
    .returning();
  return res.pop();
}

// FIX: this function ignores userId...
export async function deleteUserPlaylist(userId: string, playlistId: number) {
  await db.delete(playlistsSchema).where(eq(playlistsSchema.id, playlistId));
}

export async function createUserPlaylist(userId: string, name: string) {
  const res = await db
    .insert(playlistsSchema)
    .values({
      name: name,
      userId: userId,
    })
    .returning();
  return res.pop();
}
