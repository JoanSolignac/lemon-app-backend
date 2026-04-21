export class PaginatedResultDto<T>{
    data!: T[];
    meta!: {
        page: number,
        limit: number,
        total: number,
    }   
}