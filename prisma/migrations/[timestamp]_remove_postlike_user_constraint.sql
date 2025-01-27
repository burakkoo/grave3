-- Drop the foreign key constraint on PostLike.userId
ALTER TABLE "PostLike" DROP CONSTRAINT IF EXISTS "PostLike_userId_fkey"; 