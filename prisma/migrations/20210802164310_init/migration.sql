-- CreateTable
CREATE TABLE "send_users" (
    "server_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    PRIMARY KEY ("server_id","user_id")
);

-- CreateTable
CREATE TABLE "send_channel" (
    "server_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "send_channel.server_id_unique" ON "send_channel"("server_id");
