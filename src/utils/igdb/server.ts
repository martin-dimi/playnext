import { env } from "@/env";
import igdb from "igdb-api-node";

// Infer the client type from the return type of the igdb function
export type ImdbClient = ReturnType<typeof igdb>;

let client: ImdbClient | null = null;

export function createClient(): ImdbClient {
  if (!client) {
    const clientId = env.TWITCH_CLIENT_ID;
    const accessToken = env.TWITCH_ACCESS_TOKEN;
    client = igdb(clientId, accessToken);
  }

  return client;
}
