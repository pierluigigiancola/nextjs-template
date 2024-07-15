import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(
  "postgres://postgres:password@localhost:5432/tandem"
);

export const db = drizzle(queryClient, { schema });
