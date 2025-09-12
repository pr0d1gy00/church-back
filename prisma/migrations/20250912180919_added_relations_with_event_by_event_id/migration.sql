-- AlterTable
ALTER TABLE "public"."notification_users" ADD COLUMN     "eventId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."notification_users" ADD CONSTRAINT "notification_users_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
