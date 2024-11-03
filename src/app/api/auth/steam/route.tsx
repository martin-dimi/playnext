import { env } from "@/env";
import { syncSteamGames } from "@/server/steam/games";
import { syncProfile } from "@/server/steam/profile";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import openid from "openid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.log("Got steam auth request", searchParams);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("No user");
    redirect("/error");
  }

  try {
    const steamId = await resolveSteamId(request);
    await syncProfile(supabase, user.id, steamId);
    await syncSteamGames(steamId);
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

// /auth/steam?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=id_res&openid.op_endpoint=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Flogin&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198042650870&openid.identity=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198042650870&openid.return_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsteam&openid.response_nonce=2024-11-02T13%3A45%3A58Znv5Y6%2BQgBIPielrbTTWzRSgbtSA%3D&openid.assoc_handle=1234567890&openid.signed=signed%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Cresponse_nonce%2Cassoc_handle&openid.sig=8TETyA7M%2BRkOSJaGgCkhYvDtw7M%3D
