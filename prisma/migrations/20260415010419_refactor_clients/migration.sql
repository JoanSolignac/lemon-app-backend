/*
  Warnings:

  - Added the required column `tipo_cliente` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Made the column `numero_telefono` on table `clientes` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('MINORISTA', 'MAYORISTA');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "tipo_cliente" "TipoCliente" NOT NULL,
ALTER COLUMN "numero_telefono" SET NOT NULL;
