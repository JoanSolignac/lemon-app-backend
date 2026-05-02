/*
  Warnings:

  - Made the column `user_id` on table `dispositivos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dispositivos" DROP CONSTRAINT "dispositivos_user_id_fkey";

-- AlterTable
ALTER TABLE "dispositivos" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
