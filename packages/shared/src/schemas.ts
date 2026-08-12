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
});
export type ServiceLogInput = z.infer<typeof serviceLogInputSchema>;
