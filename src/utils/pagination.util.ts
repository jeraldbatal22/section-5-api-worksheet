// types/pagination.types.ts
export interface I_PaginationOptions {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface I_PaginationResult {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface I_PaginatedResponse<T> {
  data: T[];
  pagination: I_PaginationResult;
}

// utils/pagination.helper.ts
export class PaginationHelper {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  /**
   * Normalize pagination parameters
   */
  static normalize(options: I_PaginationOptions): { limit: number; offset: number } {
    let { limit = this.DEFAULT_LIMIT, offset = 0, page } = options;

    // Convert page to offset if provided
    if (page !== undefined && page > 0) {
      offset = (page - 1) * limit;
    }

    // Ensure limit is within bounds
    limit = Math.min(Math.max(1, limit), this.MAX_LIMIT);
    offset = Math.max(0, offset);

    return { limit, offset };
  }

  /**
   * Calculate pagination metadata
   */
  static calculate(total: number, limit: number, offset: number): I_PaginationResult {
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    const hasNext = offset + limit < total;
    const hasPrev = offset > 0;

    return {
      total,
      limit,
      offset,
      page,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  /**
   * Create a paginated response
   */
  static paginate<T>(
    data: T[],
    total: number,
    options: I_PaginationOptions
  ): I_PaginatedResponse<T> {
    const { limit, offset } = this.normalize(options);
    const pagination = this.calculate(total, limit, offset);
    return {
      data,
      pagination,
    };
  }

  /**
   * Get SQL LIMIT and OFFSET for database queries
   */
  static toSQL(options: I_PaginationOptions): { limit: number; offset: number } {
    return this.normalize(options);
  }
}