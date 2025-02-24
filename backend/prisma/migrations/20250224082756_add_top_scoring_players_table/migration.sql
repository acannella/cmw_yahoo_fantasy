-- CreateTable
CREATE TABLE "top_scoring_players" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "player_name" VARCHAR NOT NULL,
    "points" DECIMAL(6,2) NOT NULL,
    "manager" VARCHAR NOT NULL,
    "week" INTEGER NOT NULL,

    CONSTRAINT "top_scoring_players_pk" PRIMARY KEY ("id")
);
