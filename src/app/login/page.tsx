import { HydrateClient } from "play/trpc/server";
import { loginWithEmail } from "./actions";
import { Label } from "@radix-ui/react-label";
import { Button } from "play/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "play/components/ui/card";
import { Input } from "play/components/ui/input";

export default async function Login() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <LoginCard />
      </main>
    </HydrateClient>
  );
}

const LoginCard = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>This is a email login. SSO coming up.</CardDescription>
      </CardHeader>
      <form>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Email" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button formAction={loginWithEmail}>Login</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
