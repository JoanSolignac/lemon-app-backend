const MAX_LIMIT = 100;

/**
 * Normaliza los parámetros de paginación.
 *
 * @param params Objeto con `page` y `limit`.
 * @returns Valores validados:
 * - page >= 1
 * - limit entre 1 y MAX_LIMIT
 *
 * Debe ejecutarse antes de calcular skip/take.
 */
export const normalizePaginationDto = (params: { page: number; limit: number }) => {
    let { page, limit } = params;

    page = Math.max(page, 1);
    limit = Math.min(Math.max(limit, 1), MAX_LIMIT);

    return { page, limit };
};

/**
 * Calcula skip y take para paginación.
 *
 * @param params Objeto con `page` y `limit` normalizados.
 * @returns Objeto con `skip` y `take`.
 *
 * Asume que ya se ejecutó normalizePaginationDto.
 */
export const calculateSkipTakeForPagination = (params: { page: number; limit: number }) => {
    const skip = (params.page - 1) * params.limit;

    return {
        skip,
        take: params.limit,
    };
};