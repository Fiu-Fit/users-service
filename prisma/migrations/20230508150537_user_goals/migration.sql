-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('InProgress', 'Completed', 'CompletedLate');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Fullbody', 'Freeweight', 'Stretching', 'Strength');

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "actualValue" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "category" "Category" NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'InProgress',

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
