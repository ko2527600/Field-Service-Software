import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { serializeUnit } from "./units.service.js";

const invoiceInclude = { lineItems: { include: { unit: true } } } as const;

export async function getPortalMe(userId: string, customerId: string) {
  const [user, customer] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { business: { select: { name: true } } } }),
    prisma.customer.findUnique({ where: { id: customerId }, select: { id: true, name: true } }),
  ]);
  if (!user || !customer) throw new HttpError(404, "Not found");
  return { businessName: user.business.name, customer };
}

export async function getPortalUnits(customerId: string) {
  const units = await prisma.unit.findMany({
    where: { customerId, archivedAt: null },
    orderBy: { renewalDate: "asc" },
  });
  return units.map(serializeUnit);
}

export async function getPortalInvoices(customerId: string) {
  return prisma.invoice.findMany({
    where: { customerId },
    include: invoiceInclude,
    orderBy: { issueDate: "desc" },
  });
}

export async function getPortalInvoice(customerId: string, id: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { ...invoiceInclude, business: true, customer: true },
  });
  if (!invoice || invoice.customerId !== customerId) {
    throw new HttpError(404, "Invoice not found");
  }
  return invoice;
}
