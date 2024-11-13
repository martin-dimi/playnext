"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
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
}: PropsWithChildren & { game: Game }) {
  const { data: playlists } = useQuery({
    queryKey: ["playlists"],
    queryFn: () => getUserPlaylists(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="z-[1000]">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Favourites
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>

            {playlists?.map((playlist) => {
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
                >
                  {isGameInPlaylist && <Check />}
                  {playlist.name}
                </ContextMenuItem>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
