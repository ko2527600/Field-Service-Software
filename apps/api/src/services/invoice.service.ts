import type { CreateInvoiceInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { createPaymentLink } from "../lib/hubtelPayments.js";

const invoiceInclude = {
  business: true,
  customer: true,
  lineItems: { include: { unit: true } },
} as const;

export async function listInvoices(businessId: string, customerId?: string) {
  return prisma.invoice.findMany({
    where: { businessId, customerId },
    include: { customer: { select: { name: true } } },
    orderBy: { issueDate: "desc" },
  });
}

export async function getInvoice(businessId: string, id: string) {
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: invoiceInclude });
  if (!invoice || invoice.businessId !== businessId) {
    throw new HttpError(404, "Invoice not found");
  }
  return invoice;
}

/**
 * Numbering is race-safe: the sequence bump is an atomic single-row UPDATE
 * (Postgres serializes concurrent updates to the same row), and it happens
 * inside the same transaction as the invoice insert so a failed create
 * never leaves a consumed-but-unused sequence number.
 */
export async function createInvoice(businessId: string, input: CreateInvoiceInput) {
  const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
  if (!customer || customer.archivedAt || customer.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }

  for (const item of input.lineItems) {
    if (!item.unitId) continue;
    const unit = await prisma.unit.findUnique({ where: { id: item.unitId } });
    if (!unit || unit.customerId !== input.customerId) {
      throw new HttpError(400, `Line item references a unit that doesn't belong to this customer`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const updatedBusiness = await tx.business.update({
      where: { id: businessId },
      data: { nextInvoiceSeq: { increment: 1 } },
      select: { nextInvoiceSeq: true },
    });
    const usedSeq = updatedBusiness.nextInvoiceSeq - 1;
    const invoiceNumber = `INV-${String(usedSeq).padStart(4, "0")}`;

    const lineItemsData = input.lineItems.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      return {
        description: item.description,
        unitId: item.unitId || null,
        serviceType: item.serviceType || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
      };
    });
    const subtotal = lineItemsData.reduce((sum, item) => sum + item.lineTotal, 0);

    return tx.invoice.create({
      data: {
        businessId,
        customerId: input.customerId,
        invoiceNumber,
        dueDate: input.dueDate,
        notes: input.notes || null,
        subtotal,
        total: subtotal,
        lineItems: { create: lineItemsData },
      },
      include: invoiceInclude,
    });
  });
}

export async function deleteInvoice(businessId: string, id: string) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing || existing.businessId !== businessId) {
    throw new HttpError(404, "Invoice not found");
  }
  await prisma.invoice.delete({ where: { id } });
}

/**
 * Generates (or regenerates) a Hubtel MoMo/card payment link for an invoice.
 * This is a deliberate admin action rather than something invoked automatically
 * on invoice creation, since Hubtel credentials may not be configured.
 */
export async function generatePaymentLink(businessId: string, id: string) {
  const invoice = await getInvoice(businessId, id);

  const apiPublicUrl = (process.env.API_PUBLIC_URL ?? "http://localhost:4000").replace(/\/$/, "");
  const webPublicUrl = (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(",")[0]!.replace(/\/$/, "");

  const result = await createPaymentLink({
    clientReference: invoice.invoiceNumber,
    totalAmount: Number(invoice.total),
    description: `Invoice ${invoice.invoiceNumber} - ${invoice.business.name}`,
    callbackUrl: `${apiPublicUrl}/api/v1/webhooks/hubtel`,
    returnUrl: `${webPublicUrl}/invoices/${invoice.id}`,
  });

  if (!result.ok) {
    throw new HttpError(502, result.error);
  }

  return prisma.invoice.update({
    where: { id },
    data: { paymentLink: result.checkoutUrl },
    include: invoiceInclude,
  });
}

/**
 * Marks the invoice matching a Hubtel clientReference (== our invoiceNumber)
 * as paid. Idempotent: a webhook Hubtel retries after a slow/failed response
 * is a no-op the second time, since we never revert an already-paid invoice.
 */
export async function markInvoicePaidByReference(clientReference: string, transactionId?: string) {
  const invoice = await prisma.invoice.findUnique({ where: { invoiceNumber: clientReference } });
  if (!invoice) return null;
  if (invoice.paymentStatus === "PAID") return invoice;

  return prisma.invoice.update({
    where: { id: invoice.id },
    data: { paymentStatus: "PAID", paidAt: new Date(), hubtelTransactionId: transactionId ?? null },
  });
}
