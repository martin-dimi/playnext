"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  return (
    <nav className="flex h-[100px] w-full items-center justify-end p-4 opacity-60">
      <Link href="/profile">
        <User size={24} color={pathname === "/profile" ? "#FFCD00" : "#fff"} />
      </Link>
    </nav>
  );
}
