"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import { ModalPlaylistDelete } from "~/components/playlists/modalPlaylistDelete";
import { cn } from "~/lib/utils";
import { Playlist } from "~/types/game";

export default function SidebarItem({
  children,
  name,
  playlist,
}: PropsWithChildren & { name: string; playlist?: Playlist }) {
  const pathname = usePathname();

  return (
    <h2
      className={cn(
        "font-chakra flex items-center justify-start gap-1 text-[14px] font-bold",
        {
          "text-[#FFCD00]": pathname === name,
          "text-white": pathname !== name,
        },
      )}
    >
      <Link href={name}>{children}</Link>

      {playlist && <ModalPlaylistDelete playlist={playlist} />}
    </h2>
  );
}
