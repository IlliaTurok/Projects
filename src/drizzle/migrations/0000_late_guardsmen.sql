CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"due_date" timestamp with time zone DEFAULT now(),
	"completed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
