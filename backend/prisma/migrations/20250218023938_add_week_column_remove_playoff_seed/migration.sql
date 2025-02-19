/*
  Warnings:

  - You are about to drop the column `playoff_seed` on the `league_standings` table. All the data in the column will be lost.
  - Added the required column `week` to the `league_standings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "league_standings" DROP COLUMN "playoff_seed",
ADD COLUMN     "week" INTEGER NOT NULL;
