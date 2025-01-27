-- Drop the foreign key constraint for PostLike.userId
ALTER TABLE "PostLike" DROP CONSTRAINT IF EXISTS "PostLike_userId_fkey";

-- Drop and recreate the unique index without the foreign key constraint
DROP INDEX IF EXISTS "PostLike_userId_postId_key";
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId"); 