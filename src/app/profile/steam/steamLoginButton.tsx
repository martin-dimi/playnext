"use client";

import { Button } from "@ui/button";
import { steamLogin } from "./actions";

export const SteamLoginButton = () => {
  return (
    <Button
      className="dark:bg-gold dark:text-black"
      onClick={() => steamLogin()}
    >
      Connect to steam
    </Button>
  );
};
