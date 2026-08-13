import type { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      businessId?: string;
      userId?: string;
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
  next();
}
