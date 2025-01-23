/*
  Warnings:

  - Added the required column `team_key` to the `matchups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matchups" ADD COLUMN     "team_key" VARCHAR NOT NULL;
