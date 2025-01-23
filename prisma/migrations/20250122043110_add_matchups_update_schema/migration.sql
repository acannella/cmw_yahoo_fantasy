/*
  Warnings:

  - The primary key for the `config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `config_id` on the `config` table. All the data in the column will be lost.
  - You are about to drop the column `fantasy_team_id` on the `fantasy_teams` table. All the data in the column will be lost.
  - Made the column `key` on table `config` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `config` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `yahoo_fantasy_id` to the `fantasy_teams` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `waiver_priority` on the `fantasy_teams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `week_number` on the `fantasy_weeks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `league_id` on the `league_metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game_key` on the `league_metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `player_id` on the `nfl_players` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "config" DROP CONSTRAINT "config_pk",
DROP COLUMN "config_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "key" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ADD CONSTRAINT "config_pk" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fantasy_teams" DROP COLUMN "fantasy_team_id",
ADD COLUMN     "yahoo_fantasy_id" INTEGER NOT NULL,
DROP COLUMN "waiver_priority",
ADD COLUMN     "waiver_priority" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "fantasy_weeks" DROP COLUMN "week_number",
ADD COLUMN     "week_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "league_metadata" DROP COLUMN "league_id",
ADD COLUMN     "league_id" INTEGER NOT NULL,
DROP COLUMN "game_key",
ADD COLUMN     "game_key" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "nfl_players" RENAME CONSTRAINT "nfl_players_metadata_pk" TO "nfl_players_pk";
ALTER TABLE "nfl_players" DROP COLUMN "player_id",
ADD COLUMN     "player_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "matchups" (
    "id" SERIAL NOT NULL,
    "league_key" VARCHAR NOT NULL,
    "week" INTEGER NOT NULL,
    "winner_team_key" VARCHAR NOT NULL,
    "winner_proj_points" INTEGER NOT NULL,
    "winner_points" INTEGER NOT NULL,
    "loser_team_key" VARCHAR NOT NULL,
    "loser_proj_points" INTEGER NOT NULL,
    "loser_points" INTEGER NOT NULL,

    CONSTRAINT "matchups_pk" PRIMARY KEY ("id")
);
