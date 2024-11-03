"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function PsnCard({ userId }: { userId: string }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Card className="w-[350px] h-[300px]">
      <CardHeader>
        <CardTitle>Connect to Playstation</CardTitle>
        <CardDescription>
          To import your Playstation profile and games, you need to connect your
          psn account. <br />
          <u>
            <em>Your steam account needs to be public.</em>
          </u>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row gap-2 items-center justify-center h-[90px]">
        <pre className="text-sm text-muted">
          {clicked ? "No. Not yet." : "Not connected."}
        </pre>
      </CardContent>

      <CardFooter className="justify-end flex gap-4">
        <Button onClick={() => setClicked(true)} className="dark:bg-gold">
          {clicked ? "No." : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
}
