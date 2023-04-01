/*
  Warnings:

  - The `vacationStatus` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmployeeVacationStatus" AS ENUM ('Working', 'Vacation', 'Delayed');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "vacationStatus",
ADD COLUMN     "vacationStatus" "EmployeeVacationStatus" NOT NULL DEFAULT 'Working';
