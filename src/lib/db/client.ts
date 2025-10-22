/**
 * Prisma Client Singleton
 *
 * This file ensures we use a single Prisma Client instance across the application.
 * In development, Next.js hot-reloading can cause multiple Prisma Client instances,
 * which exhausts the database connection pool. This pattern prevents that issue.
 *
 * Learn more: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Helper function to disconnect Prisma Client
 * Useful in serverless environments or scripts
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
