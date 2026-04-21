export type PaginatedResult<T> = {
    data: T[],
    page: number,
    limit: number,
    total: number
}