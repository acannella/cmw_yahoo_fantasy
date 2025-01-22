-- CreateTable
CREATE TABLE "fantasy_weeks" (
    "id" SERIAL NOT NULL,
    "week_number" VARCHAR NOT NULL,
    "start" VARCHAR NOT NULL,
    "end" VARCHAR NOT NULL,

    CONSTRAINT "fantasy_weeks_pk" PRIMARY KEY ("id")
);
