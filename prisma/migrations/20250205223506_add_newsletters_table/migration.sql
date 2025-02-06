-- CreateTable
CREATE TABLE "newsletters" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "newsletter_link" VARCHAR NOT NULL,

    CONSTRAINT "newsletters_pk" PRIMARY KEY ("id")
);
