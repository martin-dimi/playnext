"use server";

import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginWithEmail(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;

  console.log("Login in with", email);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: env.NEXT_PUBLIC_DOMAIN + "/",
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  console.log("Success. User logged in");
  revalidatePath("/login", "layout");
  redirect("/login?type=check-email");
}
