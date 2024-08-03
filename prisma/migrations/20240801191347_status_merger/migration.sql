/*
  Warnings:

  - You are about to drop the `CharacterStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EpisodeStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_statusId_fkey";

-- DropTable
DROP TABLE "CharacterStatus";

-- DropTable
DROP TABLE "EpisodeStatus";

-- CreateTable
CREATE TABLE "status" (
    "statusId" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("statusId")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("statusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("statusId") ON DELETE SET NULL ON UPDATE CASCADE;
