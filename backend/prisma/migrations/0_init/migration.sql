-- CreateTable
CREATE TABLE "config" (
    "key" VARCHAR,
    "value" VARCHAR,
    "config_id" SERIAL NOT NULL,

    CONSTRAINT "config_pk" PRIMARY KEY ("config_id")
);

-- CreateTable
CREATE TABLE "fantasy_teams" (
    "id" SERIAL NOT NULL,
    "fantasy_team_key" VARCHAR NOT NULL,
    "fantasy_team_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "waiver_priority" VARCHAR NOT NULL,

    CONSTRAINT "fantasy_teams_pk" PRIMARY KEY ("id")
);

