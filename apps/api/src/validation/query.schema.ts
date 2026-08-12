import { z } from "zod";
import { UNIT_STATUSES } from "@ledgio/shared";

export const unitListQuerySchema = z.object({
  status: z.enum(UNIT_STATUSES).optional(),
  customerId: z.string().uuid().optional(),
  sort: z.enum(["renewalDate:asc", "renewalDate:desc"]).optional(),
});

export const customerListQuerySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(["name:asc", "name:desc", "createdAt:desc"]).optional(),
});
