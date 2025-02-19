-- CreateTable
CREATE TABLE "record_book" (
    "id" SERIAL NOT NULL,
    "record_name" VARCHAR NOT NULL,
    "team_name" VARCHAR NOT NULL,
    "year" INTEGER NOT NULL,
    "record_data" VARCHAR NOT NULL,

    CONSTRAINT "record_book_pk" PRIMARY KEY ("id")
);
