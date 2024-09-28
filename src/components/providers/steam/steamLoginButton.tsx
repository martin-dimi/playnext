"use client";

import { Button } from "@ui/button";
import { steamLogin } from "./actions";

export const SteamLoginButton = () => {
  return <Button onClick={() => steamLogin()}>Connect to steam</Button>;
};
