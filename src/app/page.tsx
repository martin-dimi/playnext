import { redirect } from "next/navigation";
import { LogoutButton } from "play/components/logoutButton";
import { SteamLoginButton } from "play/components/providers/steam/steamLoginButton";
import { HydrateClient } from "play/trpc/server";
import { createClient } from "play/utils/supabase/server";
import type { SteamGame, SteamProfile } from "./auth/steam/route";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "play/components/ui/card";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="dark flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <SteamProfilePage />
      </main>
    </HydrateClient>
  );
}

const SteamProfilePage = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/error");
  }

  const res = await supabase
    .from("steam_profiles")
    .select("*")
    .eq("userid", user?.id)
    .single();

  if (!res.data) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connect to your steam account</CardTitle>
          <CardDescription>
            To get your steam profile and games, you need to connect your steam
            account. Your steam account needs to be public. Otherwise this
            doesn&apos;t work.
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <SteamLoginButton />
        </CardFooter>
      </Card>
    );
  }

  const gameRes = await supabase
    .from("steam_games")
    .select("*")
    .eq("userid", user?.id);

  const profile: SteamProfile = res.data as SteamProfile;
  const games = gameRes.data as SteamGame[];

  return (
    <div className="mt-10 flex flex-col gap-10">
      <LogoutButton />
      <Card className="flex justify-start gap-4 p-4">
        <Image
          width={500}
          height={500}
          src={profile.avatar}
          alt="avatar"
          className="h-20 w-20 rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <h1>Name: {profile.personaname}</h1>
          <h1>Id: {profile.userid}</h1>
          <h1>Games: {games.length}</h1>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {games
          // sort usign playtime
          .sort((a, b) => b.playtime_forever - a.playtime_forever)
          .map((game) => (
            <Game key={game.appid} game={game} />
          ))}
      </div>
    </div>
  );
};

const Game = ({ game }: { game: SteamGame }) => {
  const timePlayedReadable = readableTime(game.playtime_forever);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
          alt="game"
          width={100}
          height={100}
          className="h-8 w-8 rounded-lg"
        />
        <h1 className="text-lg">{game.name}</h1>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        <h1>
          <strong>App id</strong>: {game.appid}
        </h1>
        <h1>
          <strong>Playtime</strong>: {readableTime(game.playtime_forever)}
        </h1>
        <h1>
          <strong>Last played</strong>: {reableUnixTime(game.rtime_last_played)}
        </h1>
      </CardContent>
    </Card>
  );
};

//  Converts it to XhYm
function readableTime(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.floor(durationInMinutes % 60);
  return `${hours} hours ${minutes} mins`;
}

function reableUnixTime(unixTime: number): string {
  const date = new Date(unixTime * 1000);
  return date.toLocaleString();
}
