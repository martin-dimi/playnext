import EmptyGameList from "./emptyList";
import { ScrollArea } from "@ui/scroll-area";
import * as motion from "motion/react-client";
import { GameDetailsCard } from "./gameDetailsCard";
import GamesGrid from "./gamesGrid";
import type { Game } from "~/types/game";
import { cn } from "~/lib/utils";
import { getPlaylistGames, getTrendingGames } from "~/server/actions/games";

const GamesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ playlistId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { playlistId } = await params;
  const { g } = await searchParams;

  const games = (await getGamesForPlaylistId(playlistId)) ?? [];
  const selectedGame = g
    ? (games.find((game) => game.id === +g) ?? null)
    : null;

  if (games.length === 0) {
    return <EmptyGameList playlistId={playlistId} />;
  }

  const enableReorder = playlistId !== "trending";
  console.log("selectedGame", selectedGame);

  return (
    <section className="relative flex w-full justify-start gap-5 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <motion.div
          className={cn("flex flex-wrap gap-5 py-10", {
            "w-[100%]": !selectedGame,
            "w-[50%]": selectedGame,
          })}
          layout
          transition={{ duration: 0.25 }}
        >
          <GamesGrid
            canReoder={enableReorder}
            games={games}
            playlistId={+playlistId}
          />
        </motion.div>
      </ScrollArea>

      <motion.div
        className={cn(
          "absolute right-0 h-full w-[50%] min-w-[500px] text-lg font-bold",
          {
            "pointer-events-none": !selectedGame,
          },
        )}
        initial={{
          opacity: selectedGame ? 1 : 0,
          x: selectedGame ? 0 : "30%",
        }}
        animate={{
          opacity: selectedGame ? 1 : 0,
          x: selectedGame ? 0 : "30%",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <GameDetailsCard game={selectedGame} />
      </motion.div>
    </section>
  );
};

export default GamesPage;

const getGamesForPlaylistId = async (playlistId: string): Promise<Game[]> => {
  if (playlistId === "trending") {
    return getTrendingGames(50);
  }
  return getPlaylistGames(+playlistId);
};
