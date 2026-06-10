import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${process.env.MYSQL_USER || "root"}:${process.env.MYSQL_PASSWORD || ""}@${process.env.MYSQL_HOST || "localhost"}:${process.env.MYSQL_PORT || "3306"}/${process.env.MYSQL_DATABASE || "world_cup_2026"}`,
  },
})
