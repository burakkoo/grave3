-- Drop the existing foreign key constraint
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_userId_fkey";

-- Drop the existing unique index
DROP INDEX "PostLike_userId_postId_key";

-- Create new unique index without foreign key constraint
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId"); 