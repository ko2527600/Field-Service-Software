import type { LoginInput, RegisterInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { getDefaultBusinessId } from "../lib/business.js";
import { hashPassword, verifyPassword, signSessionToken } from "../lib/auth.js";
import { HttpError } from "../middleware/errorHandler.js";

function toSafeUser(user: { id: string; email: string; businessId: string }) {
  return { id: user.id, email: user.email, businessId: user.businessId };
}

/**
 * Self-locking bootstrap: the first successful register call creates the
 * one business's first (and only, for now) login. Once any user exists,
 * further self-registration is blocked — additional staff logins are a
 * future invite feature, not open signup.
 */
export async function register(input: RegisterInput) {
  const businessId = await getDefaultBusinessId();

  const existingUserCount = await prisma.user.count({ where: { businessId } });
  if (existingUserCount > 0) {
    throw new HttpError(403, "An account already exists for this business");
  }

  await prisma.business.update({ where: { id: businessId }, data: { name: input.businessName } });

  const passwordHash = await hashPassword(input.password);
  let user;
  try {
    user = await prisma.user.create({
      data: { businessId, email: input.email, passwordHash },
    });
  } catch (err: unknown) {
    if (typeof err === "object" && err && "code" in err && err.code === "P2002") {
      throw new HttpError(409, "Email already in use");
    }
    throw err;
  }

  const token = signSessionToken({ userId: user.id, businessId });
  return { token, user: toSafeUser(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw new HttpError(401, "Invalid email or password");

  const token = signSessionToken({ userId: user.id, businessId: user.businessId });
  return { token, user: toSafeUser(user) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(401, "Not authenticated");
  return toSafeUser(user);
}
