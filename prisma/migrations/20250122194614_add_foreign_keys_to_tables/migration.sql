/*
  Warnings:

  - A unique constraint covering the columns `[fantasy_team_key]` on the table `fantasy_teams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[league_key]` on the table `league_metadata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fantasy_team_key_unique" ON "fantasy_teams"("fantasy_team_key");

-- CreateIndex
CREATE UNIQUE INDEX "league_metadata_league_key_unique" ON "league_metadata"("league_key");

-- AddForeignKey
ALTER TABLE "fantasy_teams" ADD CONSTRAINT "fantasy_teams_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "fantasy_weeks" ADD CONSTRAINT "fantasy_weeks_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nfl_players" ADD CONSTRAINT "fantasy_weeks_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nfl_players" ADD CONSTRAINT "nfl_players_fantasy_team_fk" FOREIGN KEY ("team_key") REFERENCES "fantasy_teams"("fantasy_team_key") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;
