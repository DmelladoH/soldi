import { db } from "../index";
import { and, eq, gt, gte, lte, lt, or } from "drizzle-orm";

/**
 * Base repository class that provides common CRUD operations and error handling patterns
 */
export abstract class BaseRepository<T = any> {
  protected db = db;

  /**
   * Transforms database results to application types
   */
  protected transform<R>(data: T[], transformer: (item: T) => R): R[] {
    return data.map(transformer);
  }

  /**
   * Standardized error handling for database operations
   */
  protected handleDatabaseError(
    error: unknown,
    operation: string,
    entity?: string,
  ): never {
    const entityName =
      entity || this.constructor.name.replace("Repository", "");
    const errorMessage =
      error instanceof Error
        ? `Error ${operation} ${entityName}: ${error.message}`
        : `An unknown error occurred while ${operation} ${entityName}`;

    throw new Error(errorMessage);
  }

  /**
   * Standardized error handling for database queries
   */
  protected async safeExecute<R>(
    operation: () => Promise<R>,
    operationName: string,
    entityName?: string,
  ): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      this.handleDatabaseError(error, operationName, entityName);
    }
  }

  /**
   * Paginated query helper
   */
  protected applyPagination<T extends { limit?: number; offset?: number }>(
    query: any,
    options?: T,
  ) {
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    return query;
  }

  /**
   * Performance timing helper
   */
  protected async withTiming<T>(
    operation: () => Promise<T>,
    operationName: string,
    thresholds: { warn: number; critical: number } = { warn: 500, critical: 2000 }
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      // Structured logging for better monitoring
      console.log(JSON.stringify({
        type: 'performance',
        operation: operationName,
        duration,
        status: duration > thresholds.critical ? 'critical' : 
                  duration > thresholds.warn ? 'warning' : 'ok'
      }));
      
      if (duration > thresholds.critical) {
        console.warn(`[CRITICAL] ${operationName} took ${duration}ms`);
      } else if (duration > thresholds.warn) {
        console.warn(`[SLOW] ${operationName} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[ERROR] ${operationName} failed after ${duration}ms:`, error);
      throw error;
    }
  }

  /**
   * Date range filter helper - FIXED VERSION
   */
  protected applyDateRange(
    query: any,
    dateFields: { year: any; month: any },
    startDate?: { year: number; month: number },
    endDate?: { year: number; month: number },
  ) {
    const conditions = [];

    if (startDate) {
      conditions.push(
        or(
          gt(dateFields.year, startDate.year),
          and(
            eq(dateFields.year, startDate.year),
            gte(dateFields.month, startDate.month),
          ),
        ),
      );
    }

    if (endDate) {
      conditions.push(
        or(
          lt(dateFields.year, endDate.year),
          and(
            eq(dateFields.year, endDate.year),
            lte(dateFields.month, endDate.month),
          ),
        ),
      );
    }

    if (conditions.length > 0) {
      return query.where(and(...conditions));
    }

    return query;
  }
}
