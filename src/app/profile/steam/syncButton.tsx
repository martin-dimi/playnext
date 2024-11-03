"use client";

import { Button } from "@/components/ui/button";
import { syncSteamGames } from "@/server/steam/games";
import { Spinner } from "@phosphor-icons/react";
import { useMutation } from "react-query";

export function SyncButton({ steamId }: { steamId: string }) {
  const { mutate, isLoading } = useMutation(syncSteamGames);

  return (
    <Button
      className="dark:bg-gold"
      onClick={() => mutate(steamId)}
      disabled={isLoading}
    >
      {isLoading ? <Spinner className="animate-spin h-5 w-5" /> : "Sync Games"}
    </Button>
  );
}
