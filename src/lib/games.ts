import type { Game } from "~/types/game";

export const getImageId = (url: string) => {
  const id = url.split("/").pop();
  return id;
};

export type Platform = "steam" | "psn";
export const getPlatforms = (game: Game): Platform[] => {
  const platforms = [];
  if (game.steamIds.length > 0) {
    platforms.push("steam");
  }
  if (game.psnIds.length > 0) {
    platforms.push("psn");
  }
  return platforms as Platform[];
};
