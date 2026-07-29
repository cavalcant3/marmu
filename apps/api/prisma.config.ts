import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://marmu:marmu123@localhost:5432/marmu?schema=public",
  },
});
