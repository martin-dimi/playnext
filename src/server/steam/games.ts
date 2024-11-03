"use server";

import { env } from "@/env";
import { Game, UserGame } from "@/types/game";
import { getGamesFromSteamIds } from "../games/create";
import { saveUserGames } from "../games/userGames";

export const syncSteamGames = async (steamId: string): Promise<UserGame[]> => {
  const rawGames = await getSteamGames(steamId);
  const userGames = await convertToUserGames(rawGames);
  return await saveUserGames(userGames);
};

const convertToUserGames = async (
  rawGames: RawSteamGameReponse[],
): Promise<UserGame[]> => {
  const steamIds = rawGames.map((game) => game.appid.toString());

  const games = await getGamesFromSteamIds(steamIds);
  if (games === null) {
    console.log("Failed to fetch games from IGDB");
    return [];
  }

  const steamIdToGame = games.reduce(
    (acc, game) => {
      game.steamIds?.forEach((id) => {
        acc[id] = game;
      });
      return acc;
    },
    {} as Record<string, Game>,
  );

  const userGames: UserGame[] = rawGames
    .map((rawGame) => {
      const game = steamIdToGame[rawGame.appid.toString()];
      if (!game) {
        // console.warn("Failed to find game for", rawGame);
        return null;
      }

      return {
        gameId: game.id,
        platform: "steam",
        externalId: rawGame.appid.toString(),
        status: rawGame.playtime_deck_forever > 0 ? "played" : "not_played",
        playTime: rawGame.playtime_forever,
        lastPlayed: rawGame.rtime_last_played
          ? new Date(rawGame.rtime_last_played * 1000).toISOString()
          : undefined,
      };
    })
    .filter((game) => game !== null) as UserGame[];

  return userGames;
};

const getSteamGames = async (
  steamId: string,
): Promise<RawSteamGameReponse[]> => {
  if (steamId === "") {
    throw new Error("Steam ID is empty");
  }

  const url = new URL(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001",
  );
  url.searchParams.append("key", env.NEXT_PUBLIC_STEAM_API_KEY);
  url.searchParams.append("steamid", steamId);
  url.searchParams.append("include_appinfo", "true");
  url.searchParams.append("include_played_free_games", "true");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(
      "Failed to fetch steam games: " +
        res.statusText +
        " for " +
        url.toString(),
    );
  }

  const data = (await res.json()) as {
    response?: { games: RawSteamGameReponse[] };
  };
  if (data?.response?.games === null || data?.response?.games === undefined) {
    throw new Error("Steam game response is garbled: " + JSON.stringify(data));
  }

  return data.response.games;
};

interface RawSteamGameReponse {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
}
