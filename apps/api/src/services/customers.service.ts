import type { CustomerInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { getDefaultBusinessId } from "../lib/business.js";
import { HttpError } from "../middleware/errorHandler.js";
import { serializeUnit } from "./units.service.js";

export type CustomerListOptions = {
  search?: string;
  sort?: "name:asc" | "name:desc" | "createdAt:desc";
};

export async function listCustomers(options: CustomerListOptions) {
  const businessId = await getDefaultBusinessId();

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

export async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      units: {
        where: { archivedAt: null },
        include: { serviceLogs: { orderBy: { serviceDate: "desc" } } },
      },
    },
  });
  if (!customer || customer.archivedAt) throw new HttpError(404, "Customer not found");

  return {
    ...customer,
    units: customer.units.map((u) => serializeUnit(u)),
  };
}

export async function createCustomer(input: CustomerInput) {
  const businessId = await getDefaultBusinessId();
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

export async function updateCustomer(id: string, input: Partial<CustomerInput>) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.archivedAt) throw new HttpError(404, "Customer not found");

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

export async function archiveCustomer(id: string) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.archivedAt) throw new HttpError(404, "Customer not found");
  await prisma.customer.update({ where: { id }, data: { archivedAt: new Date() } });
}
