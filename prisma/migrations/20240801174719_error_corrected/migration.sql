/*
  Warnings:

  - You are about to drop the column `suibcategory` on the `CharacterCategory` table. All the data in the column will be lost.
  - You are about to drop the column `suibcategory` on the `EpisodeCategory` table. All the data in the column will be lost.
  - Added the required column `subcategory` to the `CharacterCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategory` to the `EpisodeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterCategory" DROP COLUMN "suibcategory",
ADD COLUMN     "subcategory" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EpisodeCategory" DROP COLUMN "suibcategory",
ADD COLUMN     "subcategory" TEXT NOT NULL;
