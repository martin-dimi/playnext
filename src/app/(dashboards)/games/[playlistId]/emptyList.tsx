import { Link2 } from "lucide-react";
import Link from "next/link";
import { getUserPlaylists } from "~/server/actions/games";

export default async function EmptyGameList({
  playlistId,
}: {
  playlistId: string;
}) {
  if (playlistId === "trending") {
    return <div>No trending games found. Please rerun migration.</div>;
  }

  if (playlistId === "owned") {
    return <IntegrationMissing />;
  }

  // if playlistId is not a number return early
  const pid = parseInt(playlistId);
  if (isNaN(pid)) {
    return <div>Playlist not found</div>;
  }

  const playlists = await getUserPlaylists();
  const playlist = playlists.find((p) => p.id === pid);
  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="ml-[-50px] flex h-full w-full items-center justify-center">
      <div className="h-fit w-fit">
        <span className="text-gold">{playlist.name}</span> has no games in it.
      </div>
    </div>
  );
}

function IntegrationMissing() {
  return (
    <div className="ml-[-50px] flex h-full w-full items-center justify-center">
      <div className="h-fit w-fit">
        <Link href="/profile" className="flex gap-1 text-xl">
          Please setup{" "}
          <span className="text-gold flex items-center gap-1">
            Steam <Link2 className="text-gold" />
          </span>{" "}
          integration
        </Link>
      </div>
    </div>
  );
}
