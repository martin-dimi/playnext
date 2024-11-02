"use client";

import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-start justify-center p-4 space-y-[30px]">
      <Group>
        <Title>Lists</Title>
        <Item active={pathname === "/games/trending"}>Trending</Item>
      </Group>

      <Group>
        <Title>Your Games</Title>
        <Item active={pathname === "/games/steam"}>Steam</Item>
        <Item active={pathname === "/games/psn"}>Playstation</Item>
      </Group>
    </nav>
  );
}

const Group = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col items-start space-y-2">{children}</div>;
};

const Title = ({ children }: PropsWithChildren) => {
  return <h1 className="text-[10px] font-chakra">{children}</h1>;
};

const Item = ({
  children,
  active,
}: PropsWithChildren & { active: boolean }) => {
  return (
    <h2
      className={cn("text-[12px] font-chakra font-bold", {
        "text-[#FFCD00]": active,
        "text-white": !active,
      })}
    >
      {children}
    </h2>
  );
};
