import { eq, desc, asc } from "drizzle-orm";
import { movementTag } from "../schema";
import { MovementTag } from "@/types/database";
import { BaseRepository } from "./base.repository";

interface MovementTagQueryOptions {
  type?: "expense" | "income";
  orderBy?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export class MovementTagsRepository extends BaseRepository {

  /**
   * Get all movement tags with optional filtering
   */
  async findMany(options: MovementTagQueryOptions = {}): Promise<MovementTag[]> {
    return this.safeExecute(async () => {
      const { type, orderBy = "asc" } = options;
      
      // Build query options dynamically
      const queryOptions: any = {
        orderBy: [
          orderBy === "desc" 
            ? desc(movementTag.name) 
            : asc(movementTag.name)
        ],
      };
      
      if (type) {
        queryOptions.where = eq(movementTag.type, type);
      }
      
      if (options.limit) {
        queryOptions.limit = options.limit;
      }
      if (options.offset) {
        queryOptions.offset = options.offset;
      }
      
      const tags = await this.db.query.movementTag.findMany(queryOptions);
      
      // Transform to match expected types
      return this.transform(tags, (tag) => ({
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      }));
    }, "fetching movement tags", "MovementTag");
  }

  /**
   * Get a single movement tag by ID
   */
  async findById(id: number): Promise<MovementTag | null> {
    return this.safeExecute(async () => {
      const tag = await this.db.query.movementTag.findFirst({
        where: eq(movementTag.id, id)
      });
      
      if (!tag) return null;
      
      return {
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      };
    }, "finding movement tag by ID", "MovementTag");
  }

  /**
   * Get movement tags by type
   */
  async findByType(type: "expense" | "income"): Promise<MovementTag[]> {
    return this.findMany({ type });
  }

  /**
   * Create a new movement tag
   */
  async create(tagData: Omit<MovementTag, "id">): Promise<MovementTag> {
    return this.safeExecute(async () => {
      const [tag] = await this.db
        .insert(movementTag)
        .values({
          name: tagData.name,
          type: tagData.type,
        })
        .returning();
      
      return {
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      };
    }, "creating movement tag", "MovementTag");
  }

  /**
   * Update a movement tag
   */
  async update(id: number, data: Partial<Omit<MovementTag, "id">>): Promise<MovementTag> {
    return this.safeExecute(async () => {
      const [tag] = await this.db
        .update(movementTag)
        .set({
          ...(data.name && { name: data.name }),
          ...(data.type && { type: data.type }),
        })
        .where(eq(movementTag.id, id))
        .returning();
      
      if (!tag) {
        throw new Error(`Movement tag with ID ${id} not found`);
      }
      
      return {
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      };
    }, "updating movement tag", "MovementTag");
  }

  /**
   * Delete a movement tag
   */
  async delete(id: number): Promise<MovementTag> {
    return this.safeExecute(async () => {
      const [tag] = await this.db
        .delete(movementTag)
        .where(eq(movementTag.id, id))
        .returning();
      
      if (!tag) {
        throw new Error(`Movement tag with ID ${id} not found`);
      }
      
      return {
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      };
    }, "deleting movement tag", "MovementTag");
  }

  /**
   * Search movement tags by name
   */
  async searchByName(searchTerm: string): Promise<MovementTag[]> {
    return this.safeExecute(async () => {
      // Note: This would need like() operator for proper search
      const tags = await this.db.query.movementTag.findMany({
        where: eq(movementTag.name, searchTerm)
      });
      
      return this.transform(tags, (tag) => ({
        id: tag.id,
        name: tag.name,
        type: tag.type as "expense" | "income",
      }));
    }, "searching movement tags by name", "MovementTag");
  }

  /**
   * Get only expense tags
   */
  async getExpenseTags(): Promise<MovementTag[]> {
    return this.findByType("expense");
  }

  /**
   * Get only income tags
   */
  async getIncomeTags(): Promise<MovementTag[]> {
    return this.findByType("income");
  }
}