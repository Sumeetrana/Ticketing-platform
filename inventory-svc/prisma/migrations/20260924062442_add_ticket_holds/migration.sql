-- AlterTable
ALTER TABLE "events" ADD COLUMN     "reserved" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ticket_holds" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_holds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ticket_holds_event_id" ON "ticket_holds"("event_id");

-- AddForeignKey
ALTER TABLE "ticket_holds" ADD CONSTRAINT "ticket_holds_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
