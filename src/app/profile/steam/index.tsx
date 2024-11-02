import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SteamProfile } from "@/types/steam";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { SteamLoginButton } from "./steamLoginButton";
import { SyncButton } from "./syncButton";

export default async function SteamCard({ userId }: { userId: string }) {
  const profile = await getSteamProfile(userId);

  return (
    <Card className="w-[350px] h-[300px]">
      <CardHeader>
        <CardTitle>Connect to Steam</CardTitle>
        <CardDescription>
          To get your steam profile and games, you need to connect your steam
          account.
          <br />
          <u>
            <em>Your steam account needs to be public.</em>
          </u>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row gap-2 items-center justify-center h-[90px]">
        {profile ? (
          <>
            <Image
              className="rounded-md"
              src={profile.avatar!!}
              alt="Steam profile picture"
              width={64}
              height={64}
            />

            <div className="">
              <h3 className="text-gold">
                Connected as{" "}
                <span className="text-gold">{profile.username}</span>
              </h3>
              <h3 className="text-white">
                Last synced: <span className="italic">Today</span>
                <span className="text-muted text-xs"> (fake news)</span>
              </h3>
            </div>
          </>
        ) : (
          <pre className="text-sm text-muted">Not connected.</pre>
        )}
      </CardContent>

      <CardFooter className="justify-end flex gap-4">
        {profile ? (
          <>
            <Button variant="ghost">Disconnect</Button>
            <SyncButton steamId={profile.id} />
          </>
        ) : (
          <SteamLoginButton />
        )}
      </CardFooter>
    </Card>
  );
}

async function getSteamProfile(userId: string): Promise<SteamProfile | null> {
  const supabase = createClient();

  const res = await supabase
    .from("profiles_steam")
    .select("*")
    .eq("userId", userId)
    .single();

  return res.data;
}
