import { User } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function NavBar({ current }: { current: string }) {
  return (
    <nav className="w-full min-h-[100px] flex items-center justify-end opacity-60 p-4">
      <Link href="/profile">
        <User size={24} color={current === "profile" ? "#FFCD00" : "#fff"} />
      </Link>
    </nav>
  );
}
