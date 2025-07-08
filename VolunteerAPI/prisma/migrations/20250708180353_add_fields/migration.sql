/*
  Warnings:

  - Added the required column `avatarUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "leaderboardRank" INTEGER;

-- CreateTable
CREATE TABLE "_UserOpportunities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserOpportunities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserOpportunities_B_index" ON "_UserOpportunities"("B");

-- AddForeignKey
ALTER TABLE "_UserOpportunities" ADD CONSTRAINT "_UserOpportunities_A_fkey" FOREIGN KEY ("A") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOpportunities" ADD CONSTRAINT "_UserOpportunities_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
