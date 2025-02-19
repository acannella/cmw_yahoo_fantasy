/*
  Warnings:

  - Added the required column `league_key` to the `fantasy_teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league_key` to the `fantasy_weeks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fantasy_teams" ADD COLUMN     "league_key" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "fantasy_weeks" ADD COLUMN     "league_key" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "league_metadata" (
    "id" SERIAL NOT NULL,
    "league_key" VARCHAR NOT NULL,
    "league_id" VARCHAR NOT NULL,
    "game_key" VARCHAR NOT NULL,
    "league_name" VARCHAR NOT NULL,

    CONSTRAINT "league_metadata_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfl_players" (
    "id" SERIAL NOT NULL,
    "player_key" VARCHAR NOT NULL,
    "player_id" VARCHAR NOT NULL,
    "league_key" VARCHAR NOT NULL,
    "team_key" VARCHAR NOT NULL,
    "player_name" VARCHAR NOT NULL,
    "nfl_team_name" VARCHAR NOT NULL,
    "uniform_number" INTEGER NOT NULL,
    "display_position" VARCHAR NOT NULL,
    "is_undroppable" BOOLEAN NOT NULL,
    "eligible_positions" VARCHAR[],

    CONSTRAINT "nfl_players_metadata_pk" PRIMARY KEY ("id")
);
