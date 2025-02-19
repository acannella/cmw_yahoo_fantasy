-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "transaction_key" VARCHAR NOT NULL,
    "league_key" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "players_in_transaction" JSON[],

    CONSTRAINT "transactions_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_league_metadata_fk" FOREIGN KEY ("league_key") REFERENCES "league_metadata"("league_key") ON DELETE RESTRICT ON UPDATE RESTRICT;
