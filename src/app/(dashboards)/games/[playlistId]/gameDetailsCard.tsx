"use client";

import { Card } from "@ui/card";
import { ScrollArea } from "@ui/scroll-area";
import { Heart, Plus, WalletCards, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { getImageId } from "~/lib/games";
import { cn } from "~/lib/utils";
import { Game } from "~/types/game";

export function GameDetailsCard({
  className,
  game,
}: {
  game: Game | null;
  className?: string;
}) {
  const router = useRouter();

  if (!game) return null;

  return (
    <Card
      className={cn(
        "relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-b-none dark:bg-[#242424]",
        className,
      )}
    >
      <div
        className="absolute left-[28px] top-[26px] z-50 h-fit w-fit"
        onClick={() => router.push("?g=")}
      >
        <X color="#FFF" size="24px" />
      </div>

      <div className="absolute right-[28px] top-[26px] z-50 h-fit w-fit">
        <Heart color="#FFCD00" size="24px" />
      </div>

      <div className="relative aspect-video w-full">
        <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#242424]/0 from-15% to-[#242424]/100 to-80%" />
        <Image
          width="360"
          height="540"
          alt={game.name}
          className="h-full w-full object-cover object-top opacity-50"
          priority
          src={`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${getImageId(game.coverUrl)}`}
        />
      </div>

      <ScrollArea className="z-50 mt-[-100px] w-full">
        <div className="flex w-full flex-col gap-[18px] p-6">
          <div className="flex flex-col gap-2 leading-none">
            <p className="text-[18px] font-bold">{game.name}</p>
            <p className="text-[12px] font-light">Last played Today</p>
            <p className="text-[12px] font-light">Playtime 86h</p>
          </div>

          <div className="flex flex-col gap-2 leading-none">
            <h1 className="text-[12px] font-bold">Playlists</h1>
            <div className="flex gap-2">
              <Pill color="gray">
                <Heart color="#FFCD00" size="16px" />
                Singleplayer
              </Pill>

              <Pill color="gray">
                <WalletCards color="#FFCD00" size="16px" />
                What to play next
              </Pill>

              <Pill color="gray">
                <WalletCards color="#FFCD00" size="16px" />
                Survival builders
              </Pill>

              <Pill color="gray">
                <Plus size={10} />
              </Pill>
            </div>
          </div>

          <div className="flex flex-col gap-2 leading-none">
            <h1 className="text-[12px] font-bold">Metacritic</h1>
            <Pill color="yellow" className="w-[60px] px-0">
              86
            </Pill>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}

const Pill = ({
  children,
  className,
  color,
}: PropsWithChildren & { className?: string; color: "gray" | "yellow" }) => {
  return (
    <div
      className={cn(
        "flex w-fit items-center justify-center gap-2 rounded-[6px] px-2 py-1 text-[12px] font-semibold",
        {
          "bg-[#434343] text-white": color === "gray",
          "bg-[#FFCD00] text-black": color === "yellow",
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
