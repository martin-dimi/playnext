"use client";

import { useAuth } from "@clerk/nextjs";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function TopBar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <nav className="flex h-[100px] w-full items-center justify-end p-4 opacity-60">
      {userId ? (
        <Link href="/profile">
          <User
            size={24}
            color={pathname === "/profile" ? "#FFCD00" : "#fff"}
          />
        </Link>
      ) : (
        <Link href="/sign-in">
          <Button variant="ghost">Login</Button>
        </Link>
      )}
    </nav>
  );
}
