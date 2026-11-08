/*
  Warnings:

  - A unique constraint covering the columns `[id,organizationId]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'LOST', 'CONVERTED');

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT,
    "assignedToId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "convertedAt" TIMESTAMP(3),
    "convertedContactId" TEXT,
    "convertedCompanyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_organizationId_idx" ON "company"("organizationId");

-- CreateIndex
CREATE INDEX "company_organizationId_name_idx" ON "company"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "company_id_organizationId_key" ON "company"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "company_organizationId_nameNormalized_key" ON "company"("organizationId", "nameNormalized");

-- CreateIndex
CREATE INDEX "contact_organizationId_idx" ON "contact"("organizationId");

-- CreateIndex
CREATE INDEX "contact_organizationId_companyId_idx" ON "contact"("organizationId", "companyId");

-- CreateIndex
CREATE INDEX "contact_organizationId_email_idx" ON "contact"("organizationId", "email");

-- CreateIndex
CREATE INDEX "contact_organizationId_lastName_firstName_idx" ON "contact"("organizationId", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "contact_id_organizationId_key" ON "contact"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_convertedContactId_key" ON "lead"("convertedContactId");

-- CreateIndex
CREATE INDEX "lead_organizationId_idx" ON "lead"("organizationId");

-- CreateIndex
CREATE INDEX "lead_organizationId_status_idx" ON "lead"("organizationId", "status");

-- CreateIndex
CREATE INDEX "lead_organizationId_assignedToId_idx" ON "lead"("organizationId", "assignedToId");

-- CreateIndex
CREATE INDEX "lead_organizationId_companyId_idx" ON "lead"("organizationId", "companyId");

-- CreateIndex
CREATE INDEX "lead_organizationId_email_idx" ON "lead"("organizationId", "email");

-- CreateIndex
CREATE INDEX "lead_organizationId_lastName_firstName_idx" ON "lead"("organizationId", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "lead_id_organizationId_key" ON "lead"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_convertedContactId_organizationId_key" ON "lead"("convertedContactId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "member_id_organizationId_key" ON "member"("id", "organizationId");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_companyId_organizationId_fkey" FOREIGN KEY ("companyId", "organizationId") REFERENCES "company"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_companyId_organizationId_fkey" FOREIGN KEY ("companyId", "organizationId") REFERENCES "company"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_assignedToId_organizationId_fkey" FOREIGN KEY ("assignedToId", "organizationId") REFERENCES "member"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedContactId_organizationId_fkey" FOREIGN KEY ("convertedContactId", "organizationId") REFERENCES "contact"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedCompanyId_organizationId_fkey" FOREIGN KEY ("convertedCompanyId", "organizationId") REFERENCES "company"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
