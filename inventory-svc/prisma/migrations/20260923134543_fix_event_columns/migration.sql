/*
  Warnings:

  - You are about to drop the column `pricePerTicket` on the `events` table. All the data in the column will be lost.
  - Added the required column `price_per_ticket` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "pricePerTicket",
ADD COLUMN     "price_per_ticket" INTEGER NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;
