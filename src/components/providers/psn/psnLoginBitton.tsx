"use client";

import { loginWithPsn } from "@/server/psn/login";
import { Button } from "@ui/button";

export const PsnLoginButton = () => {
  return <Button onClick={() => loginWithPsn()}>Connect to PSN</Button>;
};
