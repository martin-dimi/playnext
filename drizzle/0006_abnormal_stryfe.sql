CREATE TABLE IF NOT EXISTS "steam_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"avatar" text NOT NULL,
	"username" text NOT NULL,
	"realname" text NOT NULL,
	"profile_url" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"synchedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_userId_gameId_pk" PRIMARY KEY("userId","gameId");