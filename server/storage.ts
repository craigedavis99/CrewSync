import {
  auditLogs,
  memberships,
  passwordResets,
  tenants,
  users,
  type AuditLog,
  type InsertMembership,
  type InsertTenant,
  type Membership,
  type Tenant,
  type User,
} from "@shared/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";

const REQUIRED_SECRET =
  process.env.JWT_SECRET || "change-me-dev-secret-for-local-only";

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derived, "hex"));
};

const hashToken = (token: string): string => {
  return createHmac("sha256", REQUIRED_SECRET).update(token).digest("hex");
};

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: {
    username: string;
    password: string;
    platformAdmin?: boolean;
  }): Promise<User>;
  verifyUserPassword(
    username: string,
    password: string,
  ): Promise<User | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenant(id: string): Promise<Tenant | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  updateMembership(
    id: string,
    updates: Partial<Pick<Membership, "role" | "status">>,
  ): Promise<Membership | undefined>;
  listMembershipsByTenant(tenantId: string): Promise<Membership[]>;
  getMembershipForUser(
    tenantId: string,
    userId: string,
  ): Promise<Membership | undefined>;
  listMembershipsForUser(userId: string): Promise<Membership[]>;
  getMembershipById(id: string): Promise<Membership | undefined>;
  listTenants(): Promise<Tenant[]>;
  createPasswordResetToken(
    userId: string,
    expiresMinutes?: number,
  ): Promise<{ token: string; expiresAt: string }>;
  consumePasswordResetToken(
    token: string,
    newPassword: string,
  ): Promise<boolean>;
  logAudit(entry: {
    tenantId?: string | null;
    actorUserId: string;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(input: {
    username: string;
    password: string;
    platformAdmin?: boolean;
  }): Promise<User> {
    const passwordHash = hashPassword(input.password);
    const [user] = await db
      .insert(users)
      .values({
        username: input.username,
        passwordHash,
        platformAdmin: Boolean(input.platformAdmin),
      })
      .returning();
    return user;
  }

  async verifyUserPassword(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    const isValid = verifyPassword(password, user.passwordHash);
    return isValid ? user : undefined;
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(insertTenant).returning();
    return tenant;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createMembership(
    insertMembership: InsertMembership,
  ): Promise<Membership> {
    const existing = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.tenantId, insertMembership.tenantId),
          eq(memberships.userId, insertMembership.userId),
        ),
      )
      .limit(1);
    if (existing[0]) return existing[0];

    const [membership] = await db
      .insert(memberships)
      .values(insertMembership)
      .returning();
    return membership;
  }

  async updateMembership(
    id: string,
    updates: Partial<Pick<Membership, "role" | "status">>,
  ): Promise<Membership | undefined> {
    const [updated] = await db
      .update(memberships)
      .set(updates)
      .where(eq(memberships.id, id))
      .returning();
    return updated;
  }

  async listMembershipsByTenant(tenantId: string): Promise<Membership[]> {
    return db
      .select()
      .from(memberships)
      .where(eq(memberships.tenantId, tenantId));
  }

  async getMembershipForUser(
    tenantId: string,
    userId: string,
  ): Promise<Membership | undefined> {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(
        and(eq(memberships.tenantId, tenantId), eq(memberships.userId, userId)),
      )
      .limit(1);
    return membership;
  }

  async listMembershipsForUser(userId: string): Promise<Membership[]> {
    return db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, userId));
  }

  async getMembershipById(id: string): Promise<Membership | undefined> {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(eq(memberships.id, id))
      .limit(1);
    return membership;
  }

  async listTenants(): Promise<Tenant[]> {
    return db.select().from(tenants);
  }

  async createPasswordResetToken(
    userId: string,
    expiresMinutes = 60,
  ): Promise<{ token: string; expiresAt: string }> {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
    await db.insert(passwordResets).values({
      userId,
      tokenHash: hashToken(token),
      expiresAt: expiresAt.toISOString(),
    });
    return { token, expiresAt: expiresAt.toISOString() };
  }

  async consumePasswordResetToken(
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    const hashed = hashToken(token);
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.tokenHash, hashed))
      .limit(1);
    if (!reset) return false;
    if (new Date(reset.expiresAt).getTime() < Date.now()) return false;

    const newHash = hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, reset.userId));

    // clean up used token
    await db
      .delete(passwordResets)
      .where(eq(passwordResets.id, reset.id));
    return true;
  }

  async logAudit(entry: {
    tenantId?: string | null;
    actorUserId: string;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values({
        tenantId: entry.tenantId ?? null,
        actorUserId: entry.actorUserId,
        action: entry.action,
        targetType: entry.targetType ?? null,
        targetId: entry.targetId ?? null,
        metadata: entry.metadata ?? null,
      })
      .returning();
    return log;
  }
}

export const storage = new PostgresStorage();
