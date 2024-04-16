ALTER TABLE "recruitment" ADD COLUMN "chat_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN IF EXISTS "recruitment_id";