ALTER TABLE "todos" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "completed";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");