-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
