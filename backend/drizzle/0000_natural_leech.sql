DO $$ BEGIN
 CREATE TYPE "currency" AS ENUM('pln', 'gbp', 'eur', 'usd');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "employment_type" AS ENUM('b2b', 'permanent', 'mandate', 'internship', 'task');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "level" AS ENUM('junior', 'mid', 'senior');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "work_type" AS ENUM('full_time', 'part_time', 'internship', 'freelance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_offer_id" uuid NOT NULL,
	"cv" text,
	"introduction" text,
	"accepted" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_user" (
	"chat_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "chat_user_chat_id_user_id_pk" PRIMARY KEY("chat_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recruitment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"description" text,
	"avatar_url" text,
	"background_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_offer_skill" (
	"job_offer_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	CONSTRAINT "job_offer_skill_job_offer_id_skill_id_pk" PRIMARY KEY("job_offer_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_offer_technology" (
	"job_offer_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	CONSTRAINT "job_offer_technology_job_offer_id_technology_id_pk" PRIMARY KEY("job_offer_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_offer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" text NOT NULL,
	"description" text NOT NULL,
	"level" "level" NOT NULL,
	"employment_type" "employment_type" NOT NULL,
	"work_type" "work_type" NOT NULL,
	"salary_from" integer NOT NULL,
	"salary_to" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text,
	"chat_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recruitment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technology" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"github_id" integer,
	"username" text,
	"email" text,
	"password" text,
	"avatar" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_user" ADD CONSTRAINT "chat_user_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_user" ADD CONSTRAINT "chat_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_offer_skill" ADD CONSTRAINT "job_offer_skill_job_offer_id_job_offer_id_fk" FOREIGN KEY ("job_offer_id") REFERENCES "job_offer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_offer_skill" ADD CONSTRAINT "job_offer_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_offer_technology" ADD CONSTRAINT "job_offer_technology_job_offer_id_job_offer_id_fk" FOREIGN KEY ("job_offer_id") REFERENCES "job_offer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_offer_technology" ADD CONSTRAINT "job_offer_technology_technology_id_technology_id_fk" FOREIGN KEY ("technology_id") REFERENCES "technology"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
