/*
  Warnings:

  - You are about to drop the column `siteSettingsId` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `refCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referredBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `appId` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppUser" DROP CONSTRAINT "AppUser_siteSettingsId_fkey";

-- DropIndex
DROP INDEX "User_refCode_key";

-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "siteSettingsId",
ADD COLUMN     "appId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refCode",
DROP COLUMN "refCount",
DROP COLUMN "referredBy";

-- DropTable
DROP TABLE "SiteSettings";

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_ownerId_key" ON "App"("ownerId");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
