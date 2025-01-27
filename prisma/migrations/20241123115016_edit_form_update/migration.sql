-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "favoriteMovies" TEXT[],
ADD COLUMN     "favoriteMusic" TEXT[];

-- AlterTable
ALTER TABLE "VisualMedia" ADD COLUMN     "photoUserId" TEXT,
ADD COLUMN     "videoUserId" TEXT;

-- AddForeignKey
ALTER TABLE "VisualMedia" ADD CONSTRAINT "fk_visual_media_user_photos" FOREIGN KEY ("photoUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualMedia" ADD CONSTRAINT "fk_visual_media_user_videos" FOREIGN KEY ("videoUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
