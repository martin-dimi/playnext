import { HydrateClient } from "play/trpc/server";
import { Button } from "play/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "play/components/ui/card";
import Link from "next/link";
import { LoginCard } from "./loginCard";

export default async function Login({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const type = searchParams?.type;

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {type === "check-email" ? <CheckEmail /> : <LoginCard />}
      </main>
    </HydrateClient>
  );
}

const CheckEmail = () => {
  const googleLink = "https://mail.google.com/mail/u/0";

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We&apos;ve send an email with your login link.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Link href={googleLink}>
          <Button>Go to google</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
