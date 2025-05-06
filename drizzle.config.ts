import { Config, defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

const path = ".env";
dotenv.config({ path });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
