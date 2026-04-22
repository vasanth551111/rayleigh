import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Hardcoded absolute path to avoid ANY environment variable issues
const libsql = createClient({
  url: "file:C:/Users/vasan/rayleigh/dev.db",
});

const adapter = new PrismaLibSql(libsql);

const globalForPrisma = global as any;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
