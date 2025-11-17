-- CreateEnum
CREATE TYPE "StatutValidation" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statutValidation" "StatutValidation" DEFAULT 'PENDING';
