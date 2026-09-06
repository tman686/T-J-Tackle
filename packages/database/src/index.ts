/**
 * Prisma client singleton for T&J's Tackle.
 *
 * Import `prisma` anywhere in the workspace. In development the instance is
 * cached on `globalThis` to survive hot-reload; in production a single client
 * is created per process. Run `npm run db:generate` after installing so the
 * generated client exists.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";

/** True when a database connection string is configured. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
