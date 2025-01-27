-- First drop the existing foreign key constraint
ALTER TABLE "PostLike" DROP CONSTRAINT IF EXISTS "PostLike_userId_fkey";

-- Drop and recreate the unique index
DROP INDEX IF EXISTS "PostLike_userId_postId_key";
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId");

-- Add back the foreign key constraint for postId only
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" 
FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE; 