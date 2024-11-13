"use client";

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
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPlaylistAction } from "~/server/actions/gameActions";

export function ModalPlaylistCreate() {
  const [name, setName] = useState<string>("");
  const createButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && name) {
        createButtonRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [name]);

  return (
    <Dialog>
      <DialogTrigger className="font-chakra flex items-center justify-start gap-2 text-[14px] font-bold">
        <Plus /> Playlist
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Playlist</DialogTitle>
          <DialogDescription>
            Create a new playlist to organize your games.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              ref={createButtonRef}
              onClick={() => createPlaylistAction({ name: name })}
              disabled={!name}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
