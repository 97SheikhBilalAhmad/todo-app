import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), 
  createdAt: timestamp("created_at").defaultNow(),
});
 