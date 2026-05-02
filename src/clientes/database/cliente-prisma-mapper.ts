import { Prisma } from "@prisma/client";
import { TipoDocumento, TipoCliente, Cliente } from "../types/cliente.type";
import { SELECT_CLIENTES } from "../types/cliente-select.type";

type PrismaSelectCliente = Prisma.ClienteGetPayload<{ select: typeof SELECT_CLIENTES }>;
type PrismaTipoDocumento = PrismaSelectCliente['tipoDocumento'];
type PrismaTipoCliente = PrismaSelectCliente['tipoCliente'];

export const toPrismaTipoDocumento = (value: TipoDocumento): PrismaTipoDocumento => {
    return value as PrismaTipoDocumento;
};

export const toDomainTipoDocumento = (value: PrismaTipoDocumento): TipoDocumento => {
    return value as TipoDocumento;
};

export const toPrismaTipoCliente = (value: TipoCliente): PrismaTipoCliente => {
    return value as PrismaTipoCliente;
};

export const toDomainTipoCliente = (value: PrismaTipoCliente): TipoCliente => {
    return value as TipoCliente;
};

export const toDomain = (value: PrismaSelectCliente): Cliente => ({
    ...value,
    tipoDocumento: toDomainTipoDocumento(value.tipoDocumento),
    tipoCliente: toDomainTipoCliente(value.tipoCliente),
});

export const toDomainList = (values: PrismaSelectCliente[]): Cliente[] => {
    return values.map(value => toDomain(value));
}
