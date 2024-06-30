import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    user: "postgres",
    password: "password",
    host: "localhost",
    database: "tandem",
    port: 5432,
    ssl: false,
  },
});