import { type PropsWithChildren } from "react";
import SidebarItem from "./sidebarItem";
import { ModalPlaylistCreate } from "~/components/playlists/modalPlaylistCreate";
import { getUserPlaylists } from "~/server/actions/games";

export default async function Sidebar() {
  const playlists = await getUserPlaylists();

  return (
    <nav className="flex w-[200px] flex-col items-start justify-center gap-[30px] p-4">
      <Group title="Explore">
        <SidebarItem name="/games/trending">Trending</SidebarItem>
        <SidebarItem name={"/games/all"}>Owned</SidebarItem>
      </Group>

      <Group title="Your lists">
        {playlists?.map((playlist) => (
          <SidebarItem
            key={playlist.id}
            name={`/games/${playlist.id}`}
            playlist={playlist}
          >
            {playlist.name}
          </SidebarItem>
        ))}
        <ModalPlaylistCreate />
      </Group>
    </nav>
  );
}

const Group = ({ children, title }: PropsWithChildren & { title: string }) => {
  return (
    <div className="flex w-fit flex-col items-start space-y-2">
      <h1 className="font-chakra text-[12px]">{title}</h1>
      {children}
    </div>
  );
};
