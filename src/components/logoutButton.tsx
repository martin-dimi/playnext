"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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

  return (
    <Button className="mx-4 lg:mx-0" variant="outline" onClick={signout}>
      Logout
    </Button>
  );
}
