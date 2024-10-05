"use client";

import { Button } from "@ui/button";
import { loginWithPsn } from "play/server/psn/login";

export const PsnLoginButton = () => {
  return <Button onClick={() => loginWithPsn()}>Connect to PSN</Button>;
};
