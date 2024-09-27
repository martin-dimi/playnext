import { LogoutButton } from "play/components/logoutButton";
import { HydrateClient } from "play/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        Main page
        <LogoutButton />
      </main>
    </HydrateClient>
  );
}
