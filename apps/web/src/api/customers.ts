import type { CustomerInput } from "@firearmour/shared";
import { api } from "./client.js";
import type { Customer, CustomerWithUnits } from "./types.js";

export function listCustomers(params?: { search?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.sort) qs.set("sort", params.sort);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api.get<CustomerWithUnits[]>(`/customers${suffix}`);
}

export function getCustomer(id: string) {
  return api.get<CustomerWithUnits>(`/customers/${id}`);
}

export function createCustomer(input: CustomerInput) {
  return api.post<Customer>("/customers", input);
}

export function updateCustomer(id: string, input: Partial<CustomerInput>) {
  return api.patch<Customer>(`/customers/${id}`, input);
}

export function deleteCustomer(id: string) {
  return api.delete<void>(`/customers/${id}`);
}

export type PortalAccess = { email: string | null };
export type PortalAccessCreated = { email: string; temporaryPassword: string };

export function getPortalAccess(customerId: string) {
  return api.get<PortalAccess>(`/customers/${customerId}/portal-access`);
}

export function createPortalAccess(customerId: string, email: string) {
  return api.post<PortalAccessCreated>(`/customers/${customerId}/portal-access`, { email });
}
