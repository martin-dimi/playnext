"use server";

import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginWithEmail(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;

  console.log("Logging in with email", env.NEXT_PUBLIC_DOMAIN);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: env.NEXT_PUBLIC_DOMAIN,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/login", "layout");
  redirect("/login?type=check-email");
}
