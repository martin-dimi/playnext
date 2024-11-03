"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-start justify-center p-4 gap-[30px] w-[200px]">
      <Group>
        <Title>Your Games</Title>
        <Item currentPath={pathname} pathname={"/games/all"}>
          All
        </Item>
        <Item currentPath={pathname} pathname={"/games/steam"}>
          Steam
        </Item>
      </Group>

      <Group>
        <Title>Lists</Title>
        <Item currentPath={pathname} pathname="/games/trending">
          Trending
        </Item>
      </Group>
    </nav>
  );
}

const Group = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-fit flex flex-col items-start space-y-2">{children}</div>
  );
};

const Title = ({ children }: PropsWithChildren) => {
  return <h1 className="text-[12px] font-chakra">{children}</h1>;
};

const Item = ({
  children,
  pathname,
  currentPath,
}: PropsWithChildren & { pathname: string; currentPath: string }) => {
  return (
    <Link href={pathname}>
      <h2
        className={cn("text-[14px] font-chakra font-bold", {
          "text-[#FFCD00]": currentPath === pathname,
          "text-white": currentPath !== pathname,
        })}
      >
        {children}
      </h2>
    </Link>
  );
};
