import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL_POOLED;

if (!connectionString) {
  throw new Error("DATABASE_URL_POOLED is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const result = await prisma.$queryRaw<
    { database: string; current_time: Date }[]
  >`
    SELECT
      current_database() AS database,
      CURRENT_TIMESTAMP AS current_time
  `;

  console.log("Prisma connected successfully!");
  console.log("Database:", result[0].database);
  console.log("Database time:", result[0].current_time);
}

main()
  .catch((error) => {
    console.error("Prisma connection failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });