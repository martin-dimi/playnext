import type { Game } from "@/types/game";

export const upsertGame = async (game: Game): Promise<Game> => {
  return {
    ...game,
  };
};
