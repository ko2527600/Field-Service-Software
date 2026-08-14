import { z } from "zod";
import { EXTINGUISHER_TYPES, RENEWAL_PERIODS } from "./enums.js";

export const customerInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  contactPhone: z.string().trim().optional().or(z.literal("")),
  contactEmail: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  addressLine1: z.string().trim().optional().or(z.literal("")),
  addressLine2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  businessType: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});
export type CustomerInput = z.infer<typeof customerInputSchema>;

export const unitInputSchema = z
  .object({
    type: z.enum(EXTINGUISHER_TYPES),
    size: z.string().trim().min(1, "Size is required"),
    serialNumber: z.string().trim().min(1, "Serial number is required"),
    installDate: z.coerce.date(),
    renewalPeriod: z.enum(RENEWAL_PERIODS),
    customIntervalDays: z.coerce.number().int().positive().optional(),
    location: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.renewalPeriod !== "CUSTOM" || !!data.customIntervalDays, {
    message: "customIntervalDays is required when renewalPeriod is CUSTOM",
    path: ["customIntervalDays"],
  });
export type UnitInput = z.infer<typeof unitInputSchema>;

export const unitUpdateSchema = z.object({
  type: z.enum(EXTINGUISHER_TYPES).optional(),
  size: z.string().trim().min(1).optional(),
  serialNumber: z.string().trim().min(1).optional(),
  installDate: z.coerce.date().optional(),
  renewalPeriod: z.enum(RENEWAL_PERIODS).optional(),
  customIntervalDays: z.coerce.number().int().positive().optional(),
  renewalDate: z.coerce.date().optional(),
  location: z.string().trim().optional().or(z.literal("")),
});
export type UnitUpdateInput = z.infer<typeof unitUpdateSchema>;

export const serviceLogInputSchema = z.object({
  serviceDate: z.coerce.date(),
  technician: z.string().trim().optional().or(z.literal("")),
  amountCharged: z.coerce.number().nonnegative().optional(),
  notes: z.string().trim().optional().or(z.literal("")),
  nextDueDate: z.coerce.date(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  clientRequestId: z.string().trim().optional().or(z.literal("")),
});
export type ServiceLogInput = z.infer<typeof serviceLogInputSchema>;

export const registerInputSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const businessProfileInputSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  addressLine1: z.string().trim().optional().or(z.literal("")),
  addressLine2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  email2: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  smsRemindersEnabled: z.coerce.boolean().default(false),
  smsReminderDaysBefore: z.coerce.number().int().min(1, "Must be at least 1 day").max(90, "Must be 90 days or fewer"),
});
export type BusinessProfileInput = z.infer<typeof businessProfileInputSchema>;

export const invoiceLineItemInputSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  unitId: z.string().trim().optional().or(z.literal("")),
  serviceType: z.string().trim().optional().or(z.literal("")),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
});
export type InvoiceLineItemInput = z.infer<typeof invoiceLineItemInputSchema>;

export const portalAccessInputSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});
export type PortalAccessInput = z.infer<typeof portalAccessInputSchema>;

export const createInvoiceSchema = z.object({
  customerId: z.string().trim().min(1, "Customer is required"),
  dueDate: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.date().optional()),
  notes: z.string().trim().optional().or(z.literal("")),
  lineItems: z.array(invoiceLineItemInputSchema).min(1, "Add at least one line item"),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
