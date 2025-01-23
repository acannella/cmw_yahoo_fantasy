/*
  Warnings:

  - Made the column `end_date` on table `league_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `league_metadata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "league_metadata" ALTER COLUMN "end_date" SET NOT NULL,
ALTER COLUMN "start_date" SET NOT NULL;
