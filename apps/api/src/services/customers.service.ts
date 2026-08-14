import type { CustomerInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { hashPassword, generateTempPassword } from "../lib/auth.js";
import { serializeUnit } from "./units.service.js";

export type CustomerListOptions = {
  search?: string;
  sort?: "name:asc" | "name:desc" | "createdAt:desc";
};

export async function listCustomers(businessId: string, options: CustomerListOptions) {
  const orderBy =
    options.sort === "name:desc"
      ? { name: "desc" as const }
      : options.sort === "createdAt:desc"
        ? { createdAt: "desc" as const }
        : { name: "asc" as const };

  const customers = await prisma.customer.findMany({
    where: {
      businessId,
      archivedAt: null,
      ...(options.search
        ? { name: { contains: options.search, mode: "insensitive" as const } }
        : {}),
    },
    include: { units: { where: { archivedAt: null } } },
    orderBy,
  });

  return customers.map(({ units, ...customer }) => ({
    ...customer,
    unitCount: units.length,
    units: units.map((u) => serializeUnit(u)),
  }));
}

export async function getCustomer(businessId: string, id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      units: {
        where: { archivedAt: null },
        include: { serviceLogs: { orderBy: { serviceDate: "desc" } } },
      },
    },
  });
  if (!customer || customer.archivedAt || customer.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }

  return {
    ...customer,
    units: customer.units.map((u) => serializeUnit(u)),
  };
}

export async function createCustomer(businessId: string, input: CustomerInput) {
  return prisma.customer.create({
    data: {
      businessId,
      name: input.name,
      contactPhone: input.contactPhone || null,
      contactEmail: input.contactEmail || null,
      addressLine1: input.addressLine1 || null,
      addressLine2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || null,
      postalCode: input.postalCode || null,
      businessType: input.businessType || null,
      notes: input.notes || null,
    },
  });
}

export async function updateCustomer(businessId: string, id: string, input: Partial<CustomerInput>) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.archivedAt || existing.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }

  return prisma.customer.update({
    where: { id },
    data: {
      name: input.name,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      businessType: input.businessType,
      notes: input.notes,
    },
  });
}

export async function archiveCustomer(businessId: string, id: string) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.archivedAt || existing.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }
  await prisma.customer.update({ where: { id }, data: { archivedAt: new Date() } });
}

export async function getPortalAccess(businessId: string, customerId: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer || customer.archivedAt || customer.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }
  const portalUser = await prisma.user.findFirst({
    where: { customerId, role: "CLIENT" },
    select: { email: true },
  });
  return { email: portalUser?.email ?? null };
}

/**
 * Creates the customer's read-only portal login if none exists, or resets
 * its email/password if one does. There's no email infrastructure yet, so
 * the generated temporary password is returned once for the admin to share
 * with the client directly -- it is never retrievable again after this call.
 */
export async function createOrResetPortalAccess(businessId: string, customerId: string, email: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer || customer.archivedAt || customer.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }

  const temporaryPassword = generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  const existingPortalUser = await prisma.user.findFirst({ where: { customerId, role: "CLIENT" } });

  try {
    const user = existingPortalUser
      ? await prisma.user.update({ where: { id: existingPortalUser.id }, data: { email, passwordHash } })
      : await prisma.user.create({
          data: { businessId, email, passwordHash, role: "CLIENT", customerId },
        });
    return { email: user.email, temporaryPassword };
  } catch (err: unknown) {
    if (typeof err === "object" && err && "code" in err && err.code === "P2002") {
      throw new HttpError(409, "That email is already in use by another login");
    }
    throw err;
  }
}
