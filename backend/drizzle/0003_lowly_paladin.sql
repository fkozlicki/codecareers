CREATE TABLE IF NOT EXISTS "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"owner_id" text NOT NULL,
	"description" text,
	"avatar_url" text,
	"background_url" text
);
