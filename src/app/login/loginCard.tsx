"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormButton } from "@/components/ui/formButton";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { loginWithEmail } from "./actions";

export const LoginCard = () => {
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
          <FormButton formAction={loginWithEmail}>Login</FormButton>
        </CardFooter>
      </form>
    </Card>
  );
};
