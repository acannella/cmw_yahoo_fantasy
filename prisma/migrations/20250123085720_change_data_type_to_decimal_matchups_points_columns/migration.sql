/*
  Warnings:

  - You are about to alter the column `winner_proj_points` on the `matchups` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,2)`.
  - You are about to alter the column `winner_points` on the `matchups` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,2)`.
  - You are about to alter the column `loser_proj_points` on the `matchups` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,2)`.
  - You are about to alter the column `loser_points` on the `matchups` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE "matchups" ALTER COLUMN "winner_proj_points" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "winner_points" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "loser_proj_points" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "loser_points" SET DATA TYPE DECIMAL(6,2);
