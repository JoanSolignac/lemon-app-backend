import { Cliente } from "./cliente.type";

export type ClienteUpdateParams = {
    id: string,
    data: Partial<Omit<Cliente,'id' | 'activo' | 'createdAt' | 'deletedAt' | 'updatedAt'>>
}