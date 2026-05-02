import { Prisma } from "@prisma/client";
import { Usuario } from "../types/usuario.type";
import { SELECT_USUARIOS } from "../types/usuario-select.type";
import { SELECT_USUARIO_FOR_AUTH } from "../types/usuario-for-auth-select.type";
import { UsuarioForAuth } from "../types/usuario-for-auth.type";
import { Rol } from "src/common/types/user-role.enum";

type PrismaUsuario = Prisma.UsuarioGetPayload<{}>;
type PrismaSelectUsuario = Prisma.UsuarioGetPayload<{ select: typeof SELECT_USUARIOS }>;
type PrismaSelectUsuarioForAuth = Prisma.UsuarioGetPayload<{ select: typeof SELECT_USUARIO_FOR_AUTH }>;
type PrismaUsuarioRol = PrismaUsuario['rol'];

export const toPrismaUsuarioRol = (value: Rol) => {
    return value as PrismaUsuarioRol;
}

export const toDomainRol = (value: PrismaUsuarioRol) => {
    return value as Rol;
}

export const toDomain = (value: PrismaSelectUsuario): Partial<Usuario> => ({
    ...value,
    rol: toDomainRol(value.rol),
} as Partial<Usuario> );

export const toDomainList = (values: PrismaSelectUsuario[]): Partial<Usuario>[] => {
    return values.map(value => toDomain(value));   
}

export const toDomainForAuth = (value: PrismaSelectUsuarioForAuth): UsuarioForAuth => ({
    ...value,
    rol: toDomainRol(value.rol),
})
