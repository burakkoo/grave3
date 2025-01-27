-- First, create a temporary table to store existing likes
CREATE TABLE "_PostLikesBackup" AS 
SELECT * FROM "PostLike";

-- Drop the foreign key constraint
ALTER TABLE "PostLike" DROP CONSTRAINT IF EXISTS "PostLike_userId_fkey";

-- Drop and recreate the unique index
DROP INDEX IF EXISTS "PostLike_userId_postId_key";
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId");

-- Restore the likes from backup
INSERT INTO "PostLike" 
SELECT * FROM "_PostLikesBackup";

-- Drop the temporary table
DROP TABLE "_PostLikesBackup"; 