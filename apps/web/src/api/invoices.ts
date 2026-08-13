import type { CreateInvoiceInput } from "@firearmour/shared";
import { api, API_BASE } from "./client.js";
import type { Invoice } from "./types.js";

export function listInvoices(params?: { customerId?: string }) {
  const qs = new URLSearchParams();
  if (params?.customerId) qs.set("customerId", params.customerId);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api.get<Invoice[]>(`/invoices${suffix}`);
}

export function getInvoice(id: string) {
  return api.get<Invoice>(`/invoices/${id}`);
}

export function createInvoice(input: CreateInvoiceInput) {
  return api.post<Invoice>("/invoices", input);
}

export function deleteInvoice(id: string) {
  return api.delete<void>(`/invoices/${id}`);
}

export function invoicePdfUrl(id: string) {
  return `${API_BASE}/invoices/${id}/pdf`;
}
