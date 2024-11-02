import { NavBar } from "@/components/navbar";
import Sidebar from "./nav";

export default function GamesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col w-screen h-screen overflow-hidden">
      <NavBar current="trending" />

      <section className="grow flex gap-4 overflow-hidden">
        <Sidebar />
        {children}
      </section>
    </main>
  );
}
