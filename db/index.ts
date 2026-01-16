import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Create postgres connection
// For query purposes (used by Drizzle ORM)
const client = postgres(connectionString);

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export schema for convenience
export * from "./schema";
