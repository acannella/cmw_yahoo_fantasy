-- CreateTable
CREATE TABLE "rosters" (
    "id" SERIAL NOT NULL,
    "team_key" VARCHAR NOT NULL,
    "roster_position" VARCHAR,
    "player_name" VARCHAR,
    "nfl_team" VARCHAR,
    "bye_week" INTEGER,
    "display_number" INTEGER,

    CONSTRAINT "rosters_pk" PRIMARY KEY ("id")
);
