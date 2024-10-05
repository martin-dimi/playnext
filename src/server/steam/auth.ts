import openid from "openid";
import { env } from "@/env";

const relyingParty = new openid.RelyingParty(
  env.NEXT_PUBLIC_DOMAIN + "/auth/steam",
  env.NEXT_PUBLIC_DOMAIN,
  true,
  false,
  [],
);

export const resolveSteamId = async (req: Request) => {
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
