import { LogoutButton } from "@/components/logoutButton";
import { NavBar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import PsnCard from "./psn";
import SteamCard from "./steam";

export default async function Profile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-col w-full h-screen">
        <NavBar current="profile" />
        <section className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl">
            You need to be logged in to view this page
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full h-screen">
      <NavBar current="profile" />
      <section className="grow flex flex-col leading-0 items-center gap-5">
        <div className="flex gap-1.5">
          <h1 className="leading-0 text-white/60">Logged in as</h1>
          <p className="leading-0 text-gold">
            <u>{user.email}</u>
          </p>
        </div>

        <div className="flex gap-2 mb-10">
          <SteamCard userId={user.id} />
          <PsnCard userId={user.id} />
        </div>

        <LogoutButton />
      </section>
    </main>
  );
}
