import {
  type User,
  type InsertUser,
  type Tenant,
  type InsertTenant,
  type Membership,
  type InsertMembership,
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenant(id: string): Promise<Tenant | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  updateMembership(
    id: string,
    updates: Partial<Pick<Membership, "role" | "status">>,
  ): Promise<Membership | undefined>;
  listMembershipsByTenant(tenantId: string): Promise<Membership[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tenants: Map<string, Tenant>;
  private memberships: Map<string, Membership>;

  constructor() {
    this.users = new Map();
    this.tenants = new Map();
    this.memberships = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = randomUUID();
    const tenant: Tenant = {
      ...insertTenant,
      id,
      createdAt: new Date().toISOString(),
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async createMembership(
    insertMembership: InsertMembership,
  ): Promise<Membership> {
    // ensure a user is only added once per tenant
    const existing = Array.from(this.memberships.values()).find(
      (m) =>
        m.tenantId === insertMembership.tenantId &&
        m.userId === insertMembership.userId,
    );
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const membership: Membership = {
      ...insertMembership,
      id,
      createdAt: new Date().toISOString(),
    };
    this.memberships.set(id, membership);
    return membership;
  }

  async updateMembership(
    id: string,
    updates: Partial<Pick<Membership, "role" | "status">>,
  ): Promise<Membership | undefined> {
    const current = this.memberships.get(id);
    if (!current) return undefined;

    const updated: Membership = { ...current, ...updates };
    this.memberships.set(id, updated);
    return updated;
  }

  async listMembershipsByTenant(tenantId: string): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(
      (m) => m.tenantId === tenantId,
    );
  }
}

export const storage = new MemStorage();
