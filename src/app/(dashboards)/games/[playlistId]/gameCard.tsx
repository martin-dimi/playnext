import Image from "next/image";
import { getImageId, getPlatforms, Platform } from "~/lib/games";
import { cn } from "~/lib/utils";
import { Game } from "~/types/game";

export interface GameCardProps {
  game: Game;
  className?: string;
  rank?: number;
}

export default function GameCard({ game, className, rank }: GameCardProps) {
  const imageId = getImageId(game.coverUrl);
  const platforms = getPlatforms(game);

  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-[12px] border-0 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]",
        GlowBorder(rank),
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[9px]">
        <div className="absolute bottom-0 left-0 right-0 h-[93px] w-full bg-gradient-to-t from-black from-30%" />

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-start gap-2">
          {rank != undefined && <NumberBox number={rank + 1} />}
          {platforms.sort().map((platform) => (
            <PlatformIcon key={platform} platform={platform} />
          ))}
        </div>

        <Image
          width="360"
          height="540"
          loading="lazy"
          draggable={false}
          src={`https://images.igdb.com/igdb/image/upload/t_720p/${imageId}`}
          alt={game.name}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function GlowBorder(rank: number | undefined) {
  return cn("", {
    "p-[3px] bg-gradient-to-br to-40% from-[#FFE785] to-[#FFCD00] shadow-[0_0px_25px_0px_rgba(255,205,0,0.4)]":
      rank === 0,
    "p-[3px] bg-gradient-to-br to-30% from-[#FFFFFF]/60 to-[#D4D4D4]/60 shadow-[0_0px_25px_0px_rgba(255,255,255,0.4)]":
      rank === 1,
    "p-[3px] bg-gradient-to-br to-22% from-[#D68F48]/50 to-[#9D5F22]/50 shadow-[0_0px_30px_0px_rgba(184,92,0,0.5)]":
      rank === 2,
  });
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const toUrl = (platform: Platform) => {
    if (platform === "psn") {
      return "/psn.png";
    }
    if (platform === "steam") {
      return "/steam.png";
    }
    return "";
  };

  const url = toUrl(platform);
  if (!url) return null;

  return (
    <Image
      width="100"
      height="100"
      className="h-[20px] w-[20px] rounded-full"
      src={toUrl(platform)}
      alt={platform}
    />
  );
}

function NumberBox({ number }: { number: number }) {
  return (
    <div className="overflow-hidden rounded-[5px] shadow-[0_2.5px_2.5px_0px_rgba(0,0,0,0.17)]">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#525252]/60"
        style={{
          borderWidth: "1.3px",
          borderImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='31' fill='none'%3e%3crect width='29.708' height='29.708' x='1.146' y='.646' stroke='url(%23a)' stroke-opacity='.5' stroke-width='1.292' rx='4.521'/%3e%3cdefs%3e%3clinearGradient id='a' x1='16.381' x2='6.926' y1='16.868' y2='5.897' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='white' stop-opacity='0'/%3e%3cstop offset='1' stop-color='white' stop-opacity='.48'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e") 8 / 8px stretch`,
        }}
      >
        {number}
      </div>
    </div>
  );
}
