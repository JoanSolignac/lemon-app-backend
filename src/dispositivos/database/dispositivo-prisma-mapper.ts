import { Prisma } from "@prisma/client";
import { Dispositivo, DeviceMetadata } from "../types/dispositivo.type";
import { SELECT_DISPOSITIVOS } from "../types/dispositivo-select.type";

type PrismaSelectDispositivo = Prisma.DispositivoGetPayload<{ select: typeof SELECT_DISPOSITIVOS }>;

export const toDomain = (value: PrismaSelectDispositivo): Dispositivo => ({
  ...value,
  metadata: value.metadata ? (value.metadata as unknown as DeviceMetadata) : null,
});

export const toDomainList = (values: PrismaSelectDispositivo[]): Dispositivo[] => {
  return values.map(value => toDomain(value));
};
