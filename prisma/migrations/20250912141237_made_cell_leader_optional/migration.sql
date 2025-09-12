-- DropForeignKey
ALTER TABLE "public"."Cell" DROP CONSTRAINT "Cell_leaderId_fkey";

-- AlterTable
ALTER TABLE "public"."Cell" ALTER COLUMN "leaderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Cell" ADD CONSTRAINT "Cell_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
