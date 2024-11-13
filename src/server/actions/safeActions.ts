import { auth } from "@clerk/nextjs/server";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  throwValidationErrors: true,
  handleServerError(error, utils) {
    console.error("Server error", error, utils.clientInput);
    return error;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { userId } });
});
