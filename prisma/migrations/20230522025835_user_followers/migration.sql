/*
  Warnings:

  - You are about to drop the column `favoriteWorkouts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favoriteWorkouts",
ADD COLUMN     "favorite_workouts" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follower_user_id_follower_id_key" ON "Follower"("user_id", "follower_id");

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
