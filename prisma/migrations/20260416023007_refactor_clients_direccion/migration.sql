/*
  Warnings:

  - Added the required column `direccion` to the `clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "direccion" TEXT NOT NULL;
