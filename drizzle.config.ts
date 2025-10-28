import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

// Load environment variables from .env.local for local development.
// Adjust the path if you keep your DB URL in a different env file.
loadEnv({ path: ".env.local" });

export default defineConfig({
  // Use the PostgreSQL dialect/driver
  dialect: "postgresql",

  // Path to your Drizzle schema
  schema: "./server/db/schema.ts",

  // Output folder for generated SQL migrations
  out: "./drizzle",

  // Database connection credentials from env
  dbCredentials: {
    // Ensure DATABASE_URL is set in your environment (e.g., .env.local)
    url: process.env.DATABASE_URL!,
  },

  // Enable verbose logging
  verbose: true,
});
