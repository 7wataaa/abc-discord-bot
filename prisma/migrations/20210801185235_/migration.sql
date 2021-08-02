/*
  Warnings:

  - The primary key for the `send_users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "send_channel" ALTER COLUMN "server_id" SET DATA TYPE TEXT,
ALTER COLUMN "channel_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "send_users" DROP CONSTRAINT "send_users_pkey",
ALTER COLUMN "server_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("server_id", "user_id");
