"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Game } from "@/types/game";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { GameDetailsCard } from "./gameDetailsCard";
import GamesGrid from "./gamesGrid";

export default function GamesBoard(props: {
  games: Game[];
  preselectedGame: Game | null;
  enableReorder: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [games, setGames] = useState(props.games);
  const [selectedGame, setSelectedGame] = useState<Game | null>(
    props.preselectedGame,
  );

  const updateSelectedGame = useCallback((game: Game | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!game) {
      params.delete("g");
    } else {
      params.set("g", game.id.toString());
    }
    router.push(pathname + "?" + params.toString());

    setSelectedGame(game);
  }, []);

  return (
    <>
      <ScrollArea className="w-full h-full">
        <motion.div
          className={cn("flex flex-wrap gap-5 py-10", {
            "w-[100%]": !selectedGame,
            "w-[50%]": selectedGame,
          })}
          layout
          transition={{ duration: 0.25 }}
        >
          <GamesGrid
            canReoder={props.enableReorder}
            games={games}
            onReorder={setGames}
            onGameClick={(g) => updateSelectedGame(g)}
          />
        </motion.div>
      </ScrollArea>

      <motion.div
        className={cn(
          "font-bold text-lg absolute right-0 min-w-[500px] w-[50%] h-full",
          {
            "pointer-events-none": !selectedGame,
          },
        )}
        initial={{ opacity: 0, x: "30%" }}
        animate={{ opacity: selectedGame ? 1 : 0, x: selectedGame ? 0 : "30%" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <GameDetailsCard
          game={selectedGame}
          onClose={() => {
            updateSelectedGame(null);
          }}
        />
      </motion.div>
    </>
  );
}
