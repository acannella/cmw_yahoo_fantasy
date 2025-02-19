-- CreateTable
CREATE TABLE "league_standings" (
    "id" SERIAL NOT NULL,
    "league_key" VARCHAR NOT NULL,
    "team_key" VARCHAR NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "ties" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "playoff_seed" INTEGER NOT NULL,
    "points_for" DECIMAL(6,2) NOT NULL,
    "points_against" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "league_standings_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "league_standings" ADD CONSTRAINT "league_standings_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "league_standings" ADD CONSTRAINT "league_standings_fantasy_team_fk" FOREIGN KEY ("team_key") REFERENCES "fantasy_teams"("fantasy_team_key") ON DELETE RESTRICT ON UPDATE RESTRICT;
