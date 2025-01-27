/*
  Warnings:

  - You are about to drop the column `timestamp` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `transaction_date` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "timestamp",
ADD COLUMN     "transaction_date" TIMESTAMP(6) NOT NULL;
