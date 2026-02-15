import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// TODO: Refactor to use API routes instead of client-side DB access
// Currently using NEXT_PUBLIC_ because client components need access
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

export const db = drizzle(sql, { schema });
