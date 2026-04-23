import { describe, expect, it } from '@jest/globals';
import { calculateSkipTakeForPagination, normalizePaginationDto } from './pagination.util';

describe('normalizePaginationDto', () => {
  it('deberia devolver valores validos sin cambiarlos', () => {
    const result = normalizePaginationDto({ page: 2, limit: 25 });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(25);
  });

  it('deberia normalizar page y limit menores a 1', () => {
    const result = normalizePaginationDto({ page: 0, limit: -5 });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });

  it('deberia limitar limit al maximo permitido', () => {
    const result = normalizePaginationDto({ page: 3, limit: 999 });

    expect(result.page).toBe(3);
    expect(result.limit).toBe(100);
  });

  it('deberia usar valores por defecto cuando recibe NaN', () => {
    const result = normalizePaginationDto({ page: Number.NaN, limit: Number.NaN });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });
});

describe('calculateSkipTakeForPagination', () => {
  it('deberia calcular skip y take con valores validos', () => {
    const result = calculateSkipTakeForPagination({ page: 3, limit: 10 });

    expect(result.skip).toBe(20);
    expect(result.take).toBe(10);
  });

  it('deberia calcular skip cero en la primera pagina', () => {
    const result = calculateSkipTakeForPagination({ page: 1, limit: 15 });

    expect(result.skip).toBe(0);
    expect(result.take).toBe(15);
  });
});

describe('pagination flow', () => {
  it('deberia normalizar y luego calcular skip y take', () => {
    const normalized = normalizePaginationDto({ page: 0, limit: 500 });
    const result = calculateSkipTakeForPagination(normalized);

    expect(normalized.page).toBe(1);
    expect(normalized.limit).toBe(100);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(100);
  });
});
