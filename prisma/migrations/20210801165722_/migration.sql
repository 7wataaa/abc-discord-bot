-- CreateTable
CREATE TABLE "SendUsers" (
    "server_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("server_id","user_id")
);

-- CreateTable
CREATE TABLE "SendChannel" (
    "server_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SendChannel.server_id_unique" ON "SendChannel"("server_id");
