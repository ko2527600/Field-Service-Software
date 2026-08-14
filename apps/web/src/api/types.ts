import type { ExtinguisherType, RenewalPeriod, UnitStatus } from "@firearmour/shared";

export type Customer = {
  id: string;
  businessId: string;
  name: string;
  contactPhone: string | null;
  contactEmail: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  businessType: string | null;
  notes: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerWithUnits = Customer & {
  unitCount?: number;
  units: Unit[];
};

export type Unit = {
  id: string;
  customerId: string;
  customerName?: string;
  type: ExtinguisherType;
  size: string;
  serialNumber: string;
  installDate: string;
  renewalPeriod: RenewalPeriod;
  customIntervalDays: number | null;
  renewalDate: string;
  location: string | null;
  archivedAt: string | null;
  status: UnitStatus;
  createdAt: string;
  updatedAt: string;
};

export type UnitWithLogs = Unit & { serviceLogs: ServiceLog[] };

export type ServiceLog = {
  id: string;
  unitId: string;
  serviceDate: string;
  technician: string | null;
  amountCharged: string | null;
  notes: string | null;
  nextDueDate: string;
  latitude: number | null;
  longitude: number | null;
  locationCapturedAt: string | null;
  createdAt: string;
};

export type DashboardSummary = {
  activeCount: number;
  dueSoonCount: number;
  expiredCount: number;
  totalUnits: number;
  totalCustomers: number;
};

export type InvoiceLineItem = {
  id: string;
  invoiceId: string;
  unitId: string | null;
  description: string;
  serviceType: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  unit?: Unit | null;
};

export type PaymentStatus = "UNPAID" | "PAID";

export type Invoice = {
  id: string;
  businessId: string;
  customerId: string;
  customer?: (Partial<Customer> & { name: string }) | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  notes: string | null;
  subtotal: string;
  total: string;
  paymentStatus: PaymentStatus;
  paymentLink: string | null;
  paidAt: string | null;
  createdAt: string;
  lineItems?: InvoiceLineItem[];
};
