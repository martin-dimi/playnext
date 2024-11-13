ALTER TABLE "playlist_games" DROP CONSTRAINT "playlist_games_playlist_id_playlists_id_fk";
--> statement-breakpoint
ALTER TABLE "playlist_games" DROP CONSTRAINT "playlist_games_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "user_games" DROP CONSTRAINT "user_games_game_id_games_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist_games" ADD CONSTRAINT "playlist_games_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist_games" ADD CONSTRAINT "playlist_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
