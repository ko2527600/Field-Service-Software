import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      businessId?: string;
      userId?: string;
      role?: UserRole;
      customerId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.businessId = session.businessId;
  req.userId = session.userId;
  req.role = session.role;
  req.customerId = session.customerId;
  next();
}

/** Blocks CLIENT-role (read-only portal) users from the full admin API surface entirely. */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

/** Restricts the client portal API to CLIENT-role users scoped to a customer -- an ADMIN token has no customerId and must not reach these routes. */
export function requirePortalAccess(req: Request, res: Response, next: NextFunction): void {
  if (req.role !== "CLIENT" || !req.customerId) {
    res.status(403).json({ error: "Portal access required" });
    return;
  }
  next();
}
