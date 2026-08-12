import { prisma } from "./prisma.js";

let cachedBusinessId: string | null = null;

/**
 * No auth in this phase (single small-business usage) — every row still
 * carries a businessId FK so multi-tenant auth can be bolted on later
 * without a schema rewrite. This lazily gets-or-creates the one business.
 */
export async function getDefaultBusinessId(): Promise<string> {
  if (cachedBusinessId) return cachedBusinessId;

  const existing = await prisma.business.findFirst();
  if (existing) {
    cachedBusinessId = existing.id;
    return existing.id;
  }

  const created = await prisma.business.create({ data: { name: "My Business" } });
  cachedBusinessId = created.id;
  return created.id;
}
