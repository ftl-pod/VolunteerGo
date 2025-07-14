/*
  Warnings:

  - A unique constraint covering the columns `[leaderboardRank]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "User_leaderboardRank_key" ON "User"("leaderboardRank");
