import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    // Redirect to the home page if the user is already signed in
    redirect("/games");
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <SignIn routing="hash" />
    </main>
  );
}
