import { env } from "@/env";
import { syncSteamProfile } from "@/server/steam/profile";
import { syncSteamGames } from "@/server/steam/syncSteamGames";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import openid from "openid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.log("Got steam auth request", searchParams);

  const { userId } = await auth();
  if (!userId) {
    console.error("No user");
    redirect("/error");
  }

  try {
    const steamId = await resolveSteamId(request);
    await syncSteamProfile(userId, steamId);
    await syncSteamGames(userId, steamId);
  } catch (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/profile", "layout");
  redirect("/profile");
}

const resolveSteamId = async (req: Request) => {
  const relyingParty = new openid.RelyingParty(
    env.NEXT_PUBLIC_DOMAIN + "/api/auth/steam",
    env.NEXT_PUBLIC_DOMAIN,
    true,
    false,
    [],
  );

  return new Promise<string>((resolve, reject) => {
    relyingParty.verifyAssertion(req, (error, result) => {
      if (error) {
        reject(new Error("Failed to verify assertion:" + error?.message));
        return;
      }

      console.log("Got steam auth request", result);
      const chunks = result?.claimedIdentifier?.split("/") ?? [];
      if (result?.authenticated !== true || chunks.length === 0) {
        reject(new Error("Failed to verify assertion"));
        return;
      }

      const steamId = chunks.pop() ?? "";
      resolve(steamId);
    });
  });
};
