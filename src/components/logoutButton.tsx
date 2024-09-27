"use client";

import { createClient } from "play/utils/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const signout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return <Button onClick={signout}>Logout</Button>;
}
