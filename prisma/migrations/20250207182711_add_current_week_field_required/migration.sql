/*
  Warnings:

  - Made the column `current_week` on table `league_metadata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "league_metadata" ALTER COLUMN "current_week" SET NOT NULL;
