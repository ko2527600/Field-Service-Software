import { api, API_BASE } from "./client.js";
import type { Invoice, Unit } from "./types.js";

export type PortalMe = { businessName: string; customer: { id: string; name: string } };

export function getPortalMe() {
  return api.get<PortalMe>("/portal/me");
}

export function getPortalUnits() {
  return api.get<Unit[]>("/portal/units");
}

export function getPortalInvoices() {
  return api.get<Invoice[]>("/portal/invoices");
}

export function portalInvoicePdfUrl(id: string) {
  return `${API_BASE}/portal/invoices/${id}/pdf`;
}
