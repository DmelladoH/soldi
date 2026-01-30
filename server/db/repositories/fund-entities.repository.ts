import { eq, desc, asc } from "drizzle-orm";
import { fundEntities, monthlyReportInvestments } from "../schema";
import { FundEntity, FundEntityWithId } from "@/types/database";
import { BaseRepository } from "./base.repository";

interface FundEntityQueryOptions {
  type?: string;
  currency?: string;
  orderBy?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export class FundEntitiesRepository extends BaseRepository {

  /**
   * Get all fund entities with optional filtering
   */
  async findMany(options: FundEntityQueryOptions = {}): Promise<FundEntityWithId[]> {
    return this.safeExecute(async () => {
      const { type, currency, orderBy = "asc" } = options;
      
      // Build query options dynamically
      const queryOptions: any = {
        orderBy: [
          orderBy === "desc" 
            ? desc(fundEntities.name) 
            : asc(fundEntities.name)
        ],
      };
      
      if (type) {
        queryOptions.where = eq(fundEntities.type, type);
      } else if (currency) {
        queryOptions.where = eq(fundEntities.currency, currency);
      }
      
      if (options.limit) {
        queryOptions.limit = options.limit;
      }
      if (options.offset) {
        queryOptions.offset = options.offset;
      }
      
      const entities = await this.db.query.fundEntities.findMany(queryOptions);
      
      const entityResults = await this.db.query.fundEntities.findMany(queryOptions);
      
      // Transform to match expected types
      return this.transform(entityResults, (entity) => ({
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      }));
    }, "fetching fund entities", "FundEntity");
  }

  /**
   * Get a single fund entity by ID
   */
  async findById(id: number): Promise<FundEntityWithId | null> {
    return this.safeExecute(async () => {
      const entity = await this.db.query.fundEntities.findFirst({
        where: eq(fundEntities.id, id)
      });
      
      if (!entity) return null;
      
      return {
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      };
    }, "finding fund entity by ID", "FundEntity");
  }

  /**
   * Get a fund entity by ISIN
   */
  async findByISIN(ISIN: string): Promise<FundEntityWithId | null> {
    return this.safeExecute(async () => {
      const entity = await this.db.query.fundEntities.findFirst({
        where: eq(fundEntities.ISIN, ISIN)
      });
      
      if (!entity) return null;
      
      return {
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      };
    }, "finding fund entity by ISIN", "FundEntity");
  }

  /**
   * Create a new fund entity
   */
  async create(fundEntity: FundEntity): Promise<FundEntityWithId> {
    return this.safeExecute(async () => {
      const [entity] = await this.db
        .insert(fundEntities)
        .values({
          ISIN: fundEntity.ISIN,
          name: fundEntity.name,
          currency: fundEntity.currency,
          type: fundEntity.type,
        })
        .returning();
      
      return {
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      };
    }, "creating fund entity", "FundEntity");
  }

  /**
   * Update a fund entity
   */
  async update(id: number, data: Partial<FundEntity>): Promise<FundEntityWithId> {
    return this.safeExecute(async () => {
      const [entity] = await this.db
        .update(fundEntities)
        .set({
          ...(data.ISIN && { ISIN: data.ISIN }),
          ...(data.name && { name: data.name }),
          ...(data.currency && { currency: data.currency }),
          ...(data.type && { type: data.type }),
        })
        .where(eq(fundEntities.id, id))
        .returning();
      
      if (!entity) {
        throw new Error(`Fund entity with ID ${id} not found`);
      }
      
      return {
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      };
    }, "updating fund entity", "FundEntity");
  }

  /**
   * Delete a fund entity
   */
  async delete(id: number): Promise<FundEntityWithId> {
    return this.safeExecute(async () => {
      const [entity] = await this.db
        .delete(fundEntities)
        .where(eq(fundEntities.id, id))
        .returning();
      
      if (!entity) {
        throw new Error(`Fund entity with ID ${id} not found`);
      }
      
      return {
        id: entity.id,
        ISIN: entity.ISIN,
        name: entity.name,
        currency: entity.currency,
        type: entity.type,
      };
    }, "deleting fund entity", "FundEntity");
  }

  /**
   * Get all reports/investments for a specific fund entity
   */
  async getInvestmentHistory(fundEntityId: number): Promise<any[]> {
    return this.safeExecute(async () => {
      return await this.db
        .select()
        .from(monthlyReportInvestments)
        .where(eq(monthlyReportInvestments.fundEntityId, fundEntityId));
    }, "fetching investment history", "FundEntity");
  }

  /**
   * Get fund entities by type
   */
  async findByType(type: string): Promise<FundEntityWithId[]> {
    return this.findMany({ type });
  }

  /**
   * Get fund entities by currency
   */
  async findByCurrency(currency: string): Promise<FundEntityWithId[]> {
    return this.findMany({ currency });
  }
}