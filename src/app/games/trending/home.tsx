"use client";

import GameCard from "@/components/gameCard";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Game } from "@/types/game";
import { getImageId } from "@/utils/games";
import { cn } from "@/utils/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardsThree, Heart, Plus, X } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PropsWithChildren, useCallback, useState } from "react";

function SortableItem({
  game,
  rank,
  onClick,
}: {
  game: Game;
  rank: number;
  onClick: (game: Game) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      key={game.id}
      id={`game-card-${game.id}`}
      layout
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={style}
      onClick={() => onClick(game)}
      {...attributes}
      {...listeners}
      className={cn("w-[200px] h-[300px]", {
        "opacity-50": isDragging,
      })}
    >
      <GameCard game={game} rank={rank} />
    </motion.div>
  );
}

export default function Home({ games: initGames }: { games: Game[] }) {
  const [games, setGames] = useState(initGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.5,
      },
    }),
    useSensor(TouchSensor),
  );
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over?.id) {
      setGames((items) => {
        const oldIndex = items.findIndex((g) => g.id === active.id);
        const newIndex = items.findIndex((g) => g.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const scrollOntoCard = useCallback((game: Game) => {
    // make sure the game's card is in focus (scrooled into view)
    const cardElementId = `game-card-${game?.id}`;
    const cardElement = document.getElementById(cardElementId);
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, []);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <ScrollArea className="w-full h-full">
          <SortableContext items={games} strategy={rectSortingStrategy}>
            <motion.div
              className={cn("flex flex-wrap gap-5", {
                "w-[100%]": !selectedGame,
                "w-[50%]": selectedGame,
              })}
              layout
              transition={{ duration: 0.25 }}
            >
              {games.map((game, i) => (
                <SortableItem
                  key={game.id}
                  onClick={(g) => {
                    setSelectedGame(g);

                    // Execute this in 50ms
                    setTimeout(() => {
                      scrollOntoCard(g);
                    }, 250);
                  }}
                  game={game}
                  rank={i}
                />
              ))}
            </motion.div>
          </SortableContext>
        </ScrollArea>
        <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
          {activeId ? (
            <GameCard game={games.find((g) => g.id === activeId)!!} />
          ) : null}
        </DragOverlay>
      </DndContext>

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
        <GameDetailCard
          game={selectedGame}
          onClose={() => {
            // make sure the game's card is in focus (scrooled into view)
            scrollOntoCard(selectedGame!!);
            setSelectedGame(null);
          }}
        />
      </motion.div>
    </>
  );
}

function GameDetailCard({
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
