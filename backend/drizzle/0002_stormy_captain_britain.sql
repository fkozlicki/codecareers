ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");