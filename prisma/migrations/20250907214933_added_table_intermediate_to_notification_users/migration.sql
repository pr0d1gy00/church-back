-- CreateTable
CREATE TABLE "public"."notification_users" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notification_users" ADD CONSTRAINT "notification_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_users" ADD CONSTRAINT "notification_users_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
