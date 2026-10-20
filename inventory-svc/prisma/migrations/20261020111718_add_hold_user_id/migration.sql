/*
  Warnings:

  - Added the required column `user_id` to the `ticket_holds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_holds" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "idx_ticket_holds_user_id" ON "ticket_holds"("user_id");
