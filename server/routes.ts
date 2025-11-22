import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMembershipSchema,
  insertTenantSchema,
  membershipStatusEnum,
  roleEnum,
  type Membership,
} from "@shared/schema";
import { signJwt, verifyJwt } from "./auth";

type AuthUser = {
  userId: string;
  username: string;
  platformAdmin?: boolean;
};

declare module "express-serve-static-core" {
  interface Request {
    authUser?: AuthUser;
  }
}

const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = header.slice("Bearer ".length);
  const payload = verifyJwt(token);
  if (!payload || typeof payload.userId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  req.authUser = {
    userId: payload.userId as string,
    username: payload.username as string,
    platformAdmin: Boolean(payload.platformAdmin),
  };
  next();
};

const ensureTenantRole = (
  membership: Membership | undefined,
  allowed: Array<Membership["role"]>,
) => {
  return membership && allowed.includes(membership.role);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth: register a new tenant and owner
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, password, tenantName } = req.body ?? {};
      if (!username || !password || !tenantName) {
        return res
          .status(400)
          .json({ message: "username, password, tenantName are required" });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }

      const platformAdmin =
        process.env.PLATFORM_ADMIN_EMAIL &&
        process.env.PLATFORM_ADMIN_EMAIL.toLowerCase() ===
          String(username).toLowerCase();

      const user = await storage.createUser({
        username,
        password,
        platformAdmin,
      });
      const tenant = await storage.createTenant({ name: tenantName });
      await storage.createMembership({
        tenantId: tenant.id,
        userId: user.id,
        role: "owner",
        status: "active",
        invitedBy: user.id,
      });

      const token = signJwt({
        userId: user.id,
        username: user.username,
        platformAdmin: user.platformAdmin,
      });

      await storage.logAudit({
        tenantId: tenant.id,
        actorUserId: user.id,
        action: "tenant_created",
        targetType: "tenant",
        targetId: tenant.id,
      });

      return res
        .status(201)
        .json({ token, user: { id: user.id, username: user.username }, tenant });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = req.body ?? {};
      if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
      }
      const user = await storage.verifyUserPassword(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const memberships = await storage.listMembershipsForUser(user.id);
      const token = signJwt({
        userId: user.id,
        username: user.username,
        platformAdmin: user.platformAdmin,
      });
      return res.json({ token, user, memberships });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res, next) => {
    try {
      const auth = req.authUser!;
      const user = await storage.getUser(auth.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const memberships = await storage.listMembershipsForUser(user.id);
      res.json({ user, memberships });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/request-reset", async (req, res, next) => {
    try {
      const { username } = req.body ?? {};
      if (!username) {
        return res.status(400).json({ message: "username required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.json({ ok: true });
      }
      const { token, expiresAt } = await storage.createPasswordResetToken(
        user.id,
      );
      // In production, email this token. For now, return for testing.
      res.json({ ok: true, token, expiresAt });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/reset-password", async (req, res, next) => {
    try {
      const { token, password } = req.body ?? {};
      if (!token || !password) {
        return res
          .status(400)
          .json({ message: "token and password are required" });
      }
      const success = await storage.consumePasswordResetToken(token, password);
      if (!success) return res.status(400).json({ message: "Invalid token" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  // create tenant (platform-admin only)
  app.post("/api/tenants", requireAuth, async (req, res, next) => {
    try {
      if (!req.authUser?.platformAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const parsed = insertTenantSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid tenant payload" });
      }
      const tenant = await storage.createTenant(parsed.data);
      await storage.logAudit({
        tenantId: tenant.id,
        actorUserId: req.authUser.userId,
        action: "tenant_created_admin",
        targetType: "tenant",
        targetId: tenant.id,
      });
      return res.status(201).json({ tenant });
    } catch (err) {
      next(err);
    }
  });

  app.get(
    "/api/tenants/:tenantId/members",
    requireAuth,
    async (req, res, next) => {
      try {
        const { tenantId } = req.params;
        const auth = req.authUser!;

        const membership = await storage.getMembershipForUser(
          tenantId,
          auth.userId,
        );
        if (!ensureTenantRole(membership, ["owner", "admin", "manager"])) {
          return res.status(403).json({ message: "Forbidden" });
        }

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
    },
  );

  app.post(
    "/api/tenants/:tenantId/invite",
    requireAuth,
    async (req, res, next) => {
      try {
        const { tenantId } = req.params;
        const auth = req.authUser!;
        const tenant = await storage.getTenant(tenantId);
        if (!tenant) {
          return res.status(404).json({ message: "Tenant not found" });
        }
        const actorMembership = await storage.getMembershipForUser(
          tenantId,
          auth.userId,
        );
        if (!ensureTenantRole(actorMembership, ["owner", "admin"])) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const { username, password, role, status } = req.body ?? {};
        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "username and password required" });
        }
        if (role && !roleEnum.enumValues.includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        if (status && !membershipStatusEnum.enumValues.includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }

        const existingUser = await storage.getUserByUsername(username);
        const user =
          existingUser ??
          (await storage.createUser({
            username,
            password,
            platformAdmin: false,
          }));

        const membershipPayload = insertMembershipSchema.parse({
          tenantId,
          userId: user.id,
          role: role ?? "member",
          status: status ?? "invited",
          invitedBy: auth.userId,
        });

        const membership = await storage.createMembership(membershipPayload);
        await storage.logAudit({
          tenantId,
          actorUserId: auth.userId,
          action: "member_invited",
          targetType: "membership",
          targetId: membership.id,
          metadata: { role: membership.role, status: membership.status },
        });
        return res.status(201).json({ membership, user });
      } catch (err) {
        next(err);
      }
    },
  );

  app.patch(
    "/api/memberships/:membershipId",
    requireAuth,
    async (req, res, next) => {
      try {
        const { membershipId } = req.params;
        const { role, status } = req.body ?? {};
        const auth = req.authUser!;

        if (role && !roleEnum.enumValues.includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        if (status && !membershipStatusEnum.enumValues.includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }

        const targetMembership = await storage.getMembershipById(membershipId);
        if (!targetMembership) {
          return res.status(404).json({ message: "Membership not found" });
        }

        const actorMembership = await storage.getMembershipForUser(
          targetMembership.tenantId,
          auth.userId,
        );
        if (!ensureTenantRole(actorMembership, ["owner", "admin"])) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await storage.updateMembership(membershipId, {
          role,
          status,
        });
        if (!updated) {
          return res.status(404).json({ message: "Membership not found" });
        }

        await storage.logAudit({
          tenantId: updated.tenantId,
          actorUserId: auth.userId,
          action: "membership_updated",
          targetType: "membership",
          targetId: membershipId,
          metadata: { role: updated.role, status: updated.status },
        });
        return res.json({ membership: updated });
      } catch (err) {
        next(err);
      }
    },
  );

  // platform admin route to list tenants
  app.get("/api/admin/tenants", requireAuth, async (req, res, next) => {
    try {
      if (!req.authUser?.platformAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const tenants = await storage.listTenants();
      res.json({ tenants });
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
