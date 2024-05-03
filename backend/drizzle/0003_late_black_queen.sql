ALTER TABLE "recruitment" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "recruitment" ADD COLUMN "open" boolean DEFAULT true NOT NULL;