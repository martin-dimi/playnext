"use server";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type AuthTokensResponse,
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromAccountId,
  getUserTitles,
  getUserTrophyProfileSummary,
  TrophyTitle,
} from "psn-api";

export async function loginWithPsn() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user");
    redirect("/error");
  }

  const psnAuth = await fetchPsnToken(supabase);

  const [games, profile] = await Promise.all([
    fetchPsnGames(supabase, user.id, psnAuth),
    getPsnProfile(supabase, user.id, psnAuth),
  ]);

  revalidatePath("/", "layout");

  return {
    games,
    profile,
  };
}

export interface PsnProfile {
  username: string;
  aboutMe: string;
  avatarUrl: string;
  isPlus: boolean;
  isOfficiallyVerified: boolean;
  accountId: string;
}

const getPsnProfile = async (
  supabase: SupabaseClient,
  userId: string,
  token: PsnToken,
) => {
  const profileSummary = await getUserTrophyProfileSummary(token, "me");
  const accountId = profileSummary.accountId;
  console.log("Got account id", accountId);

  const response = await getProfileFromAccountId(token, accountId);

  const profile: PsnProfile = {
    username: response.onlineId,
    aboutMe: response.aboutMe,
    avatarUrl: response.avatars[0]?.url ?? "",
    isPlus: response.isPlus,
    isOfficiallyVerified: response.isOfficiallyVerified,
    accountId,
  };

  const { error } = await supabase
    .from("psn_profiles")
    .upsert(profile)
    .select();
  if (error) {
    console.error(error);
    redirect("/error");
  }
  return profile;
};

const retrieveNPSSO = async (): Promise<string> => {
  return "pIVRVtm8c4kw0pDNJAYIbKuCVJ28lV3ZZD7XPl4fQrq8DFQjfIUdKv81tdMn5oOi";
};

export interface PsnToken extends AuthTokensResponse {
  npsso: string;
}

export interface PsnGame {
  id: string;
  name: string;
  iconUrl: string;
  platform: string;
  progress: number;
  definedtrophies: TrophyTitle["definedTrophies"];
  earledtrophies: TrophyTitle["earnedTrophies"];
  hiddenFlag: boolean;
  lastUpdatedDateTime: string;
  trophyTitleDetail?: string;
  user_id: string;
}

const fetchPsnGames = async (
  supabase: SupabaseClient,
  userId: string,
  psnToken: PsnToken,
) => {
  const userThrophies = await getUserTitles(psnToken, "me");
  const titles: PsnGame[] = userThrophies.trophyTitles.map((t: TrophyTitle) => {
    return {
      id: t.npCommunicationId,
      name: t.trophyTitleName,
      iconUrl: t.trophyTitleIconUrl,
      platform: t.trophyTitlePlatform,
      progress: t.progress,
      definedtrophies: t.definedTrophies,
      earledtrophies: t.earnedTrophies,
      hiddenFlag: t.hiddenFlag,
      lastUpdatedDateTime: t.lastUpdatedDateTime,
      trophyTitleDetail: t.trophyTitleDetail,
      user_id: userId,
    };
  });

  const { error } = await supabase.from("psn_games").upsert(titles).select();
  if (error) {
    console.error(error);
    redirect("/error");
  }

  return titles;
};

const fetchPsnToken = async (supabase: SupabaseClient): Promise<PsnToken> => {
  const npsso = await retrieveNPSSO();

  // We'll exchange your NPSSO for a special access code.
  const accessCode = await exchangeNpssoForCode(npsso);

  // 🚀 We can use the access code to get your access token and refresh token.
  const authorization = await exchangeCodeForAccessToken(accessCode);

  const token: PsnToken = {
    ...authorization,
    npsso,
  };

  const { error } = await supabase.from("psn_tokens").upsert(token).select();
  if (error) {
    console.error(error);
    redirect("/error");
  }

  return token;
};
