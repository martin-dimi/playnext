"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";

export const FormButton = ({ children, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending}>
      {pending ? "Loading..." : children}
    </Button>
  );
};
