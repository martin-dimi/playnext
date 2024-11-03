"use client";

import type { Game } from "@/types/game";
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
import { motion } from "framer-motion";
import { PropsWithChildren, useCallback, useState } from "react";
import GameCard from "./gameCard";

interface GridProps {
  games: Game[];
  canReoder: boolean;
  onReorder: (games: Game[] | ((prevGames: Game[]) => Game[])) => void;
  onGameClick: (game: Game) => void;
}

export default function GamesGrid(props: GridProps) {
  return (
    <ReorderableGrid {...props}>
      {props.games.map((game, i) => (
        <SortableItem key={game.id} onClick={props.onGameClick} game={game}>
          <GameCard game={game} rank={i} className="w-[200px] h-[300px]" />
        </SortableItem>
      ))}
    </ReorderableGrid>
  );
}

function ReorderableGrid({
  children,
  games,
  onReorder,
  canReoder,
}: PropsWithChildren & GridProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    setActiveId(null);
    if (active.id !== over?.id) {
      onReorder((prev) => {
        const oldIndex = prev.findIndex((g) => g.id === active.id);
        const newIndex = prev.findIndex((g) => g.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.5,
      },
    }),
    useSensor(TouchSensor),
  );

  if (!canReoder) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={games} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <GameCard game={games.find((g) => g.id === activeId)!!} />
        ) : null}
      </DragOverlay>
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
      className={cn("w-fit h-fit z-[10]", {
        "opacity-30": isDragging,
      })}
      {...restAttributes}
      {...listeners}
    >
      {children}
    </motion.div>
  );
}
