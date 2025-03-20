-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_proctorId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "proctorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_proctorId_fkey" FOREIGN KEY ("proctorId") REFERENCES "professor"("professorId") ON DELETE SET NULL ON UPDATE CASCADE;
