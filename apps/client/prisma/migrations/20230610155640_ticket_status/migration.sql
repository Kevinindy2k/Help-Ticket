-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('pending', 'accepted', 'resolved', 'rejected');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'pending';
