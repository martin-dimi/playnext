import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PsnCard from "./psn";
import SteamCard from "./steam";

export default async function Profile() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <section className="relative flex flex-col w-full justify-start pt-20 items-center gap-4 m-4">
      <div className="flex gap-1.5">
        <h1 className="leading-0 text-white/60">Logged in as</h1>
        <p className="leading-0 text-gold">
          <u>{user.emailAddresses[0]?.emailAddress}</u>
        </p>
      </div>

      <div className="flex gap-2 mb-10">
        <SteamCard userId={user.id} />
        <PsnCard userId={user.id} />
      </div>

      <SignOutButton />
    </section>
  );
}
