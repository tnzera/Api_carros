export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/**calculando a última página a partir do total. */
export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    limit,
    lastPage: Math.max(1, Math.ceil(total / limit)),
  };
}
