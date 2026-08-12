import type { NextFunction, Request, Response } from "express";

/**
 * No-op today (single-business usage, no login in this phase). Kept as a
 * real middleware in the request pipeline so multi-tenant auth can be
 * dropped in later without restructuring routes.
 */
export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
