/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server";

import { redirect, RedirectType } from "next/navigation";

import { env } from "@/env";
import openid, { type OpenIdError } from "openid";

const relyingParty = new openid.RelyingParty(
  env.NEXT_PUBLIC_DOMAIN + "/api/auth/steam",
  env.NEXT_PUBLIC_DOMAIN,
  true,
  false,
  [],
);

export async function steamLogin() {
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
}
