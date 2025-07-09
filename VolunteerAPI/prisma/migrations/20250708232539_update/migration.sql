/*
  Warnings:

  - You are about to drop the column `venue` on the `Opportunity` table. All the data in the column will be lost.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leaderboardRank` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "venue",
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "leaderboardRank" SET NOT NULL,
ALTER COLUMN "leaderboardRank" SET DEFAULT 0;
