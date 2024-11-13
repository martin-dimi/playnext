import { UserGame } from "@/types/game";
import { uniqBy } from "lodash";
import { conflictUpdateAllExcept, db } from "../db";
import { userGames as userGamesSchema } from "../db/schema";

export const saveUserGames = async (
  userGames: UserGame[],
): Promise<UserGame[]> => {
  const uniqueGames = uniqBy(userGames, "gameId");

  const res = await db
    .insert(userGamesSchema)
    .values(uniqueGames)
    .onConflictDoUpdate({
      target: [userGamesSchema.userId, userGamesSchema.gameId],
      set: conflictUpdateAllExcept(userGamesSchema, []),
    })
    .returning();

  return Array.from(res.values());
};
