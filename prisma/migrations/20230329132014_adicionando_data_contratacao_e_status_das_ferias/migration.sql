-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "contractDate" DATE,
ADD COLUMN     "vacationStatus" BOOLEAN NOT NULL DEFAULT false;
