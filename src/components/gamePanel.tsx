import { Game } from "@/types/game";
import { getImageId } from "@/utils/games";
import { cn } from "@/utils/utils";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { Card } from "./ui/card";

export async function GameDetailCard({
  game,
  className,
}: {
  game: Game;
  className?: string;
}) {
  return (
    <motion.div
      layout
      className={cn("w-[60%] h-full", className, {
        "w-[0%]": !game,
      })}
    >
      <Card className={cn("rounded-b-none")}>
        <Link href={`/games/trending`}>
          <div className="text-[#FFCD00] font-bold text-lg">Back</div>
        </Link>

        <img
          src={`https://images.igdb.com/igdb/image/upload/t_720p_2x/${getImageId(game.coverUrl)}`}
          alt={game.name}
          className="w-200 h-300 object-cover "
        />
      </Card>
    </motion.div>
  );
}
