import { LogoutButton } from "@/components/logoutButton";
import { PsnLoginButton } from "@/components/providers/psn/psnLoginBitton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PsnGame, PsnProfile } from "@/server/psn/login";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const PsnProfilePage = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/error");
  }

  const res = await supabase
    .from("psn_profiles")
    .select("*")
    .eq("userId", user?.id)
    .single();

  if (!res.data) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connect to your psn account</CardTitle>
          <CardDescription>
            To get your psn profile and games, you need to connect your psn
            account. Your steam account needs to be public. Otherwise this
            doesn&apos;t work.
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <PsnLoginButton />
        </CardFooter>
      </Card>
    );
  }
  // https://m.np.playstation.net/api/gamelist/v2/users/8612968262323586688/titles?categories=ps4_game,ps5_native_game&limit=250&offset=0
  //  gamelist/v2/users/8612968262323586688/titles/NPWR25220_00
  // https://us-prof.np.community.playstation.net/gamelist/v2/users/8612968262323586688/titles/NPWR25220_00

  const gameRes = await supabase
    .from("psn_games")
    .select("*")
    .eq("user_id", user?.id);

  const profile = res.data as PsnProfile;

  // @ts-ignore
  const games = gameRes.data as PsnGame[];

  return (
    <div className="mt-10 flex flex-col gap-10">
      <LogoutButton />
      <div className="px-4 lg:px-0">
        <Card className="flex justify-start gap-4 px-4 py-4 dark:bg-neutral-800">
          <img
            src={profile.avatarUrl}
            alt="avatar"
            className="h-20 w-20 rounded-lg"
          />
          <div className="flex flex-col gap-1">
            <h1>
              <strong>Name:</strong> {profile.username}
            </h1>
            <h1>
              <strong>About Me:</strong> {profile.aboutMe}
            </h1>
            <h1>
              <strong>Games:</strong> {games.length}
            </h1>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {games
          .sort((a, b) => b.progress - a.progress)
          .map((game) => (
            <Game key={game.id} game={game} />
          ))}
      </div>
    </div>
  );
};

const Game = ({ game }: { game: PsnGame }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={game.iconUrl}
          alt="game"
          className="h-8 w-8 rounded-lg"
          loading="lazy"
        />
        <h1 className="text-lg">{game.name}</h1>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        <h1>
          <strong>App id</strong>: {game.id}
        </h1>
        <h1>
          <strong>Progress</strong>: {game.progress}%
        </h1>
      </CardContent>
    </Card>
  );
};
