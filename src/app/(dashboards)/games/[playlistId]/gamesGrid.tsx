"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import * as motion from "motion/react-client";
import { useOptimisticAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import { updatePlaylistGamesAction } from "~/server/actions/gameActions";
import { Game } from "~/types/game";
import AddToPlaylistDropdown from "./addToPlaylistDropdown";
import GameCard from "./gameCard";

export default function GamesGrid(props: {
  playlistId: number;
  games: Game[];
  canReoder: boolean;
}) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.5,
      },
    }),
    useSensor(TouchSensor),
  );

  const {
    execute,
    optimisticState: { games },
  } = useOptimisticAction(updatePlaylistGamesAction, {
    currentState: { games: props.games },
    updateFn: ({ games }, { gameIds }) => {
      const newGames = gameIds.map((id) => games.find((g) => g.id === id)!);
      return {
        games: [...newGames],
      };
    },
  });

  const handleGameClick = (game: Game) => {
    router.push("?g=" + game.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id !== over?.id) {
      const oldIndex = games.findIndex((g) => g.id === active.id);
      const newIndex = games.findIndex((g) => g.id === over.id);
      const newGames = arrayMove(games, oldIndex, newIndex);

      execute({
        playlistId: props.playlistId,
        gameIds: newGames.map((g) => g.id),
      });
    }
  };

  return (
    <DndContext
      sensors={props.canReoder ? sensors : []}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={games}
        strategy={props.canReoder ? rectSortingStrategy : undefined}
      >
        {games.map((game, i) => (
          <SortableItem key={game.id} onClick={handleGameClick} game={game}>
            <AddToPlaylistDropdown
              game={game}
              currentPlaylistId={props.playlistId}
            >
              <GameCard game={game} rank={i} className="h-[300px] w-[200px]" />
            </AddToPlaylistDropdown>
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  children,
  game,
  onClick,
}: {
  game: Game;
  onClick: (game: Game) => void;
} & PropsWithChildren) {
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

  const { "aria-describedby": _, ...restAttributes } = attributes;

  return (
    <motion.div
      ref={setNodeRef}
      key={game.id}
      id={`game-card-${game.id}`}
      style={style}
      layout={isDragging ? undefined : true}
      onClick={() => onClick(game)}
      className={cn("z-[10] h-fit w-fit", {
        "opacity-30": isDragging,
      })}
      {...restAttributes}
      {...listeners}
    >
      {children}
    </motion.div>
  );
}
