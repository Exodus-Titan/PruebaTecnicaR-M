/*
  Warnings:

  - You are about to drop the column `durarion` on the `Episode` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "durarion",
ADD COLUMN     "duration" TEXT NOT NULL;
