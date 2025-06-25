/*
  Warnings:

  - You are about to drop the column `appId` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `siteSettingsId` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AppUser" DROP CONSTRAINT "AppUser_appId_fkey";

-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "appId",
ADD COLUMN     "siteSettingsId" TEXT NOT NULL;

-- DropTable
DROP TABLE "App";

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
