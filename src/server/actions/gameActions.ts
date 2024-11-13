"use server";

import { z } from "zod";
import { authActionClient } from "./safeActions";
import {
  addGameToPlaylist,
  createUserPlaylist,
  deleteUserPlaylist,
  removeGameFromPlaylist,
  updatePlaylistGames,
} from "./games";
import { revalidatePath } from "next/cache";

export const createPlaylistAction = authActionClient
  .schema(z.object({ name: z.string() }))
  .action(async ({ parsedInput: { name }, ctx }) => {
    revalidatePath("/games");
    return createUserPlaylist(ctx.userId, name);
  });

export const deletePlaylistAction = authActionClient
  .schema(z.object({ playlistId: z.number() }))
  .action(async ({ parsedInput: { playlistId }, ctx }) => {
    revalidatePath("/games");
    return deleteUserPlaylist(ctx.userId, playlistId);
  });

export const addGameToPlaylistAction = authActionClient
  .schema(z.object({ playlistId: z.number(), gameId: z.number() }))
  .action(async ({ parsedInput: { playlistId, gameId } }) => {
    await addGameToPlaylist(playlistId, gameId);
    revalidatePath("/games");
  });

export const removeGameFromPlaylistAction = authActionClient
  .schema(z.object({ playlistId: z.number(), gameId: z.number() }))
  .action(async ({ parsedInput: { playlistId, gameId } }) => {
    await removeGameFromPlaylist(playlistId, gameId);
    revalidatePath("/games");
  });

export const updatePlaylistGamesAction = authActionClient
  .schema(z.object({ playlistId: z.number(), gameIds: z.array(z.number()) }))
  .action(async ({ parsedInput: { playlistId, gameIds } }) => {
    console.log("updatePlaylistGamesAction", playlistId, gameIds);
    await updatePlaylistGames(playlistId, gameIds);
    revalidatePath("/games");
  });
