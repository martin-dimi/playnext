"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@ui/context-menu";
import { Check } from "lucide-react";
import { PropsWithChildren } from "react";
import {
  addGameToPlaylistAction,
  removeGameFromPlaylistAction,
} from "~/server/actions/gameActions";
import { getUserPlaylists } from "~/server/actions/games";
import { Game } from "~/types/game";

export default function AddToPlaylistDropdown({
  children,
  game,
  currentPlaylistId,
}: PropsWithChildren & { game: Game; currentPlaylistId: number }) {
  const { data: playlists } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getUserPlaylists(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { userId } = useAuth();
  if (!userId) return children;

  const currentPlaylist = playlists?.find(
    (playlist) => playlist.id === currentPlaylistId,
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="z-[1000]">
        {currentPlaylist && (
          <ContextMenuItem
            onClick={async (e) => {
              e.stopPropagation();
              await removeGameFromPlaylistAction({
                playlistId: currentPlaylist.id,
                gameId: game.id,
              });
            }}
            className="flex items-center gap-1"
          >
            Remove from <em className="text-gold">{currentPlaylist.name}</em>
          </ContextMenuItem>
        )}

        <ContextMenuSub>
          <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {playlists
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((playlist) => {
                const isGameInPlaylist =
                  game.playlistIds?.includes(playlist.id) ?? false;

                return (
                  <ContextMenuItem
                    key={playlist.id}
                    onClick={async (e) => {
                      e.stopPropagation();

                      if (isGameInPlaylist) {
                        await removeGameFromPlaylistAction({
                          playlistId: playlist.id,
                          gameId: game.id,
                        });
                        return;
                      }

                      await addGameToPlaylistAction({
                        playlistId: playlist.id,
                        gameId: game.id,
                      });
                    }}
                    className="flex items-center gap-1"
                  >
                    {isGameInPlaylist && (
                      <Check size={14} className="text-gold" />
                    )}
                    {playlist.name}{" "}
                    {playlist.id === currentPlaylistId && (
                      <span className="text-xs text-muted">(current)</span>
                    )}
                  </ContextMenuItem>
                );
              })}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
