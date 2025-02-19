/*
  Warnings:

  - You are about to drop the column `end` on the `fantasy_weeks` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `fantasy_weeks` table. All the data in the column will be lost.
  - Added the required column `week_end` to the `fantasy_weeks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week_start` to the `fantasy_weeks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fantasy_weeks" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "week_end" VARCHAR NOT NULL,
ADD COLUMN     "week_start" VARCHAR NOT NULL;
