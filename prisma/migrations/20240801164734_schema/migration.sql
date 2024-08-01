-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "statusId" INTEGER,
    "categoryId" INTEGER,
    "episodeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "air_date" TEXT NOT NULL,
    "episode" TEXT NOT NULL,
    "durarion" TEXT NOT NULL,
    "categoryId" INTEGER,
    "statusId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStatus" (
    "charStatusId" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "CharacterStatus_pkey" PRIMARY KEY ("charStatusId")
);

-- CreateTable
CREATE TABLE "CharacterCategory" (
    "charCategoryId" SERIAL NOT NULL,
    "suibcategory" TEXT[],

    CONSTRAINT "CharacterCategory_pkey" PRIMARY KEY ("charCategoryId")
);

-- CreateTable
CREATE TABLE "EpisodeCategory" (
    "epCategoryId" SERIAL NOT NULL,
    "suibcategory" TEXT[],

    CONSTRAINT "EpisodeCategory_pkey" PRIMARY KEY ("epCategoryId")
);

-- CreateTable
CREATE TABLE "EpisodeStatus" (
    "charStatusId" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "EpisodeStatus_pkey" PRIMARY KEY ("charStatusId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_name_key" ON "Episode"("name");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "CharacterStatus"("charStatusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CharacterCategory"("charCategoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EpisodeCategory"("epCategoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "EpisodeStatus"("charStatusId") ON DELETE SET NULL ON UPDATE CASCADE;
