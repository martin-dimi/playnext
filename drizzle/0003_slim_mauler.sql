ALTER TABLE "games" ALTER COLUMN "rating" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "steam_ids" text[] NOT NULL;