import { PaginatedParams } from "src/common/types/paginated-params.type";
import { DispositivoUpdateParams } from "../types/dispositivo-update-params.type";
import { Dispositivo } from "../types/dispositivo.type";
import { CreateDispositivo } from "../types/create-dispositivo.type";

export interface IDispositivoRepository {
    create(dispositivo: CreateDispositivo): Promise<Dispositivo>

    findById(deviceId: string): Promise<Dispositivo | null>

    findAllForPagination(params: PaginatedParams): Promise<{ data: Dispositivo[]; total: number }>

    update(params: DispositivoUpdateParams): Promise<void>

    softDelete(deviceId: string): Promise<void>
}
