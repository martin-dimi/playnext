"use client";

import { Button } from "@ui/button";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { steamLoginAction, syncSteamProfile } from "./actions";

export const SteamLoginButton = () => {
  return (
    <Button
      className="dark:bg-gold dark:text-black"
      onClick={() => steamLoginAction()}
    >
      Connect to steam
    </Button>
  );
};

export function SteamSyncButton({ steamId }: { steamId: string }) {
  const { execute, status } = useAction(syncSteamProfile);

  return (
    <Button
      className="dark:bg-gold"
      onClick={() => execute({ steamId })}
      disabled={status === "executing"}
    >
      {status === "executing" ? (
        <Loader className="animate-spin h-5 w-5" />
      ) : (
        "Sync Games"
      )}
    </Button>
  );
}
