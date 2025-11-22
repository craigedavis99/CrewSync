import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMembershipSchema,
  insertTenantSchema,
  insertUserSchema,
  roleEnum,
  membershipStatusEnum,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api
  app.post("/api/tenants", async (req, res, next) => {
    try {
      const parsed = insertTenantSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid tenant payload" });
      }
      const tenant = await storage.createTenant(parsed.data);
      return res.status(201).json({ tenant });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/tenants/:tenantId/members", async (req, res, next) => {
    try {
      const { tenantId } = req.params;
      const tenant = await storage.getTenant(tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      const memberships = await storage.listMembershipsByTenant(tenantId);
      const membersWithUsers = await Promise.all(
        memberships.map(async (membership) => {
          const user = await storage.getUser(membership.userId);
          return { membership, user };
        }),
      );
      return res.json({ members: membersWithUsers });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/tenants/:tenantId/invite", async (req, res, next) => {
    try {
      const { tenantId } = req.params;
      const tenant = await storage.getTenant(tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }

      const { username, password, role, status } = req.body ?? {};
      const parsedUser = insertUserSchema.safeParse({ username, password });
      if (!parsedUser.success) {
        return res.status(400).json({ message: "Invalid user payload" });
      }
      if (role && !roleEnum.enumValues.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      if (status && !membershipStatusEnum.enumValues.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const existingUser = await storage.getUserByUsername(username);
      const user = existingUser ?? (await storage.createUser(parsedUser.data));

      const membershipPayload = insertMembershipSchema.parse({
        tenantId,
        userId: user.id,
        role: role ?? "member",
        status: status ?? "invited",
        invitedBy: req.header("x-user-id") ?? undefined,
      });

      const membership = await storage.createMembership(membershipPayload);
      return res.status(201).json({ membership, user });
    } catch (err) {
      next(err);
    }
  });

  app.patch("/api/memberships/:membershipId", async (req, res, next) => {
    try {
      const { membershipId } = req.params;
      const { role, status } = req.body ?? {};

      if (role && !roleEnum.enumValues.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      if (status && !membershipStatusEnum.enumValues.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updated = await storage.updateMembership(membershipId, {
        role,
        status,
      });
      if (!updated) {
        return res.status(404).json({ message: "Membership not found" });
      }
      return res.json({ membership: updated });
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
