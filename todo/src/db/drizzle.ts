import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

if (!pool) {
  console.log("Database connection failed");
} else {
  console.log(process.env.DATABASE_URL, "Database connected successfully");
}

export const db = drizzle(pool , { schema }); 
  