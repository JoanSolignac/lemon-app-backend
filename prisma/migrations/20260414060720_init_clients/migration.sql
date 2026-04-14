-- CreateEnum
CREATE TYPE "TipoDoc" AS ENUM ('DNI', 'RUC');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "tipo_documento" "TipoDoc" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "numero_telefono" TEXT,
    "correo_electronico" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_numero_documento_key" ON "clientes"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_correo_electronico_key" ON "clientes"("correo_electronico");
