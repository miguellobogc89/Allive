-- AlterTable
ALTER TABLE "live_sessions" ADD COLUMN     "eventName" TEXT;

-- CreateIndex
CREATE INDEX "live_sessions_eventName_idx" ON "live_sessions"("eventName");
