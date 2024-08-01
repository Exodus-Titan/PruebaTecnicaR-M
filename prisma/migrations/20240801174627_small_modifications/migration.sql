/*
  Warnings:

  - You are about to drop the column `episodeId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_episodeId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "episodeId",
ADD COLUMN     "episodesIds" INTEGER[];

-- AlterTable
ALTER TABLE "CharacterCategory" ALTER COLUMN "suibcategory" SET NOT NULL,
ALTER COLUMN "suibcategory" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "charactersIds" INTEGER[];

-- AlterTable
ALTER TABLE "EpisodeCategory" ALTER COLUMN "suibcategory" SET NOT NULL,
ALTER COLUMN "suibcategory" SET DATA TYPE TEXT;
