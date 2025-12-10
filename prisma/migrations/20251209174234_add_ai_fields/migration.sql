-- AlterTable
ALTER TABLE "Wrap" ADD COLUMN     "archetype" TEXT,
ADD COLUMN     "keywords" JSONB,
ADD COLUMN     "vibeScore" INTEGER,
ADD COLUMN     "vibeSummary" TEXT;
