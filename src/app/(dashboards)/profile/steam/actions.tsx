"use server";

import { redirect, RedirectType } from "next/navigation";

import { env } from "@/env";
import { revalidatePath } from "next/cache";
import openid, { type OpenIdError } from "openid";
import { z } from "zod";
import { authActionClient } from "~/server/actions/safeActions";
import { syncSteamGames } from "~/server/steam/syncSteamGames";

const relyingParty = new openid.RelyingParty(
  env.NEXT_PUBLIC_DOMAIN + "/api/auth/steam",
  env.NEXT_PUBLIC_DOMAIN,
  true,
  false,
  [],
);

export const steamLoginAction = authActionClient.action(async () => {
  const urlPromise = new Promise<string>((resolve, reject) => {
    relyingParty.authenticate(
      "https://steamcommunity.com/openid",
      false,
      (err: OpenIdError | null, authUrl: string | null) => {
        if (err || !authUrl) {
          reject(new Error("Failed to get auth url:" + err?.message));
          return;
        }

        resolve(authUrl);
      },
    );
  });

  let redirectUrl = "";
  try {
    redirectUrl = await urlPromise;
  } catch (error) {
    console.error(error);
    redirect("/error");
  }

  redirect(redirectUrl, RedirectType.push);
});

export const syncSteamProfile = authActionClient
  .schema(z.object({ steamId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    syncSteamGames(parsedInput.steamId, ctx.userId);
    revalidatePath("/profile");
  });

