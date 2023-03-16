-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Admin', 'Manager', 'Employee');

-- CreateEnum
CREATE TYPE "Contract" AS ENUM ('CLT', 'PJ');

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "credential" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gmail" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "position" "Position" NOT NULL DEFAULT 'Employee',
    "role" TEXT NOT NULL,
    "contract" "Contract" NOT NULL DEFAULT 'CLT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "idManager" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_idManager_fkey" FOREIGN KEY ("idManager") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
