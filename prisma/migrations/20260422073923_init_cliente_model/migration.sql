-- CreateEnum
CREATE TYPE "TipoDoc" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('MINORISTA', 'MAYORISTA');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "tipo_documento" "TipoDoc" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "tipo_cliente" "TipoCliente" NOT NULL,
    "numero_telefono" TEXT NOT NULL,
    "correo_electronico" TEXT,
    "direccion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_numero_documento_key" ON "clientes"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_numero_telefono_key" ON "clientes"("numero_telefono");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_correo_electronico_key" ON "clientes"("correo_electronico");
