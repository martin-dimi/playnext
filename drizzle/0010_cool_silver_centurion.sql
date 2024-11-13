ALTER TABLE "playlists" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "playlists" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "playlists" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "gameId" TO "game_id";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "externalId" TO "external_id";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "lastPlayed" TO "last_played";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "user_games" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user_games" DROP CONSTRAINT "user_games_gameId_games_id_fk";
--> statement-breakpoint
ALTER TABLE "user_games" DROP CONSTRAINT "user_games_userId_gameId_pk";--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_user_id_game_id_pk" PRIMARY KEY("user_id","game_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
