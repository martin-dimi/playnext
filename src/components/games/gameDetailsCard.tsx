import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Game } from "@/types/game";
import { getImageId } from "@/utils/games";
import { cn } from "@/utils/utils";
import { CardsThree, Heart, Plus, X } from "@phosphor-icons/react";
import Image from "next/image";
import { PropsWithChildren } from "react";

export function GameDetailsCard({
  className,
  game,
  onClose,
}: {
  game: Game | null;
  className?: string;
  onClose: () => void;
}) {
  if (!game) return null;

  return (
    <Card
      className={cn(
        "rounded-b-none relative w-full h-full dark:bg-[#242424] flex flex-col gap-4 overflow-hidden",
        className,
      )}
    >
      <div
        className="z-50 absolute top-[26px] left-[28px] w-fit h-fit"
        onClick={onClose}
      >
        <X color="#FFF" size="24px" />
      </div>

      <div className="z-50 absolute top-[26px] right-[28px] w-fit h-fit">
        <Heart color="#FFCD00" size="24px" weight="fill" />
      </div>

      <div className="w-full aspect-video relative">
        <div className="absolute z-40 inset-0 bg-gradient-to-b from-15% to-80% from-[#242424]/0 to-[#242424]/100" />
        <Image
          width="360"
          height="540"
          alt={game.name}
          className="w-full h-full object-cover object-top opacity-50"
          priority
          src={`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${getImageId(game.coverUrl)}`}
        />
      </div>

      <ScrollArea className="w-full mt-[-100px] z-50 ">
        <div className="w-full flex flex-col gap-[18px] p-6">
          <div className="leading-none flex flex-col gap-2">
            <p className="font-bold text-[18px]">{game.name}</p>
            <p className="font-light text-[12px]">Last played Today</p>
            <p className="font-light text-[12px]">Playtime 86h</p>
          </div>

          <div className="leading-none flex flex-col gap-2">
            <h1 className="font-bold text-[12px]">Playlists</h1>
            <div className="flex gap-2">
              <Pill color="gray">
                <Heart color="#FFCD00" size="16px" weight="fill" />
                Singleplayer
              </Pill>

              <Pill color="gray">
                <CardsThree color="#FFCD00" size="16px" weight="fill" />
                What to play next
              </Pill>

              <Pill color="gray">
                <CardsThree color="#FFCD00" size="16px" weight="fill" />
                Survival builders
              </Pill>

              <Pill color="gray">
                <Plus size={10} />
              </Pill>
            </div>
          </div>

          <div className="leading-none flex flex-col gap-2">
            <h1 className="font-bold text-[12px]">Metacritic</h1>
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
        "rounded-[6px] font-semibold text-[12px] px-2 py-1 flex gap-2 items-center w-fit justify-center",
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
