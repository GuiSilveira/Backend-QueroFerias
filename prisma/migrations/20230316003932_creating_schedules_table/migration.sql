-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "Schedules" (
    "id" SERIAL NOT NULL,
    "idEmployee" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "employeeComment" TEXT,
    "managerComment" TEXT,
    "anticipateSalary" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "Schedules_idEmployee_fkey" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
