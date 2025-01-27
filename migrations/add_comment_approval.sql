-- Add isApproved column to Comment table
ALTER TABLE "Comment" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- Update existing comments to be approved by default (optional)
-- Remove or modify this line if you want existing comments to remain unapproved
UPDATE "Comment" SET "isApproved" = true WHERE "isApproved" = false;

-- Add an index to improve query performance when filtering by approval status
CREATE INDEX "Comment_isApproved_idx" ON "Comment"("isApproved"); 