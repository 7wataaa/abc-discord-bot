/*
  Warnings:

  - You are about to drop the `SendChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SendUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SendChannel";

-- DropTable
DROP TABLE "SendUsers";

-- CreateTable
CREATE TABLE "send_users" (
    "server_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("server_id","user_id")
);

-- CreateTable
CREATE TABLE "send_channel" (
    "server_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "send_channel.server_id_unique" ON "send_channel"("server_id");
