-- CreateTable
CREATE TABLE "contest" (
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "contest.url_unique" ON "contest"("url");
