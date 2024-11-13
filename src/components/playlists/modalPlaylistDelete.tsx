"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Trash } from "lucide-react";
import { deletePlaylistAction } from "~/server/actions/gameActions";
import type { Playlist } from "~/types/game";

export function ModalPlaylistDelete({ playlist }: { playlist: Playlist }) {
  const queryClient = useQueryClient();

  return (
    <Dialog>
      <DialogTrigger className="font-chakra flex items-center justify-start gap-2 text-[14px] font-bold">
        <Trash />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete{" "}
            <span className="text-gold">{playlist.name}</span>?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-gold"
              onClick={async (e) => {
                e.stopPropagation();
                deletePlaylistAction({ playlistId: playlist.id });
                queryClient.invalidateQueries({ queryKey: ["playlists"] });
              }}
            >
              Yes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
