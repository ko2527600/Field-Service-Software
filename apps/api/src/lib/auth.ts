import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-insecure-secret-change-me";
const TOKEN_EXPIRY = "7d";
export const SESSION_COOKIE_NAME = "fa_session";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

export type SessionPayload = {
  userId: string;
  businessId: string;
  role: UserRole;
  customerId?: string;
};

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}
