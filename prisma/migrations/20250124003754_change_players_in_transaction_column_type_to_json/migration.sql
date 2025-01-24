/*
  Warnings:

  - Changed the type of `players_in_transaction` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "players_in_transaction",
ADD COLUMN     "players_in_transaction" JSON NOT NULL;
