import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", [
  "owner",
  "admin",
  "manager",
  "member",
  "viewer",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "invited",
  "active",
  "suspended",
]);

export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull().default("member"),
  status: membershipStatusEnum("status").notNull().default("invited"),
  invitedBy: varchar("invited_by"),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTenantSchema = createInsertSchema(tenants).pick({
  name: true,
});

export const insertMembershipSchema = createInsertSchema(memberships).pick({
  tenantId: true,
  userId: true,
  role: true,
  status: true,
  invitedBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type Membership = typeof memberships.$inferSelect;
