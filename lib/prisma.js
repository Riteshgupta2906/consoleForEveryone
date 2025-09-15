import { PrismaClient } from "@/prisma/generated/client1";

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
