-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "delete_at" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
