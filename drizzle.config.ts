import { Config, defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV;
const path = NODE_ENV == "production" ? ".env.production" : ".env";
dotenv.config({ path });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
