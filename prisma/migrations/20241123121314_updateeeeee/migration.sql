/*
  Warnings:

  - You are about to drop the column `photoUserId` on the `VisualMedia` table. All the data in the column will be lost.
  - You are about to drop the column `videoUserId` on the `VisualMedia` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VisualMedia" DROP CONSTRAINT "fk_visual_media_user_photos";

-- DropForeignKey
ALTER TABLE "VisualMedia" DROP CONSTRAINT "fk_visual_media_user_videos";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "videos" TEXT[];

-- AlterTable
ALTER TABLE "VisualMedia" DROP COLUMN "photoUserId",
DROP COLUMN "videoUserId";
