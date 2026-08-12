import type { UnitInput, UnitStatus } from "@firearmour/shared";
import { api } from "./client.js";
import type { Unit, UnitWithLogs } from "./types.js";

export function listUnits(params?: { status?: UnitStatus; customerId?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.customerId) qs.set("customerId", params.customerId);
  if (params?.sort) qs.set("sort", params.sort);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api.get<Unit[]>(`/units${suffix}`);
}

export function getUnit(id: string) {
  return api.get<UnitWithLogs>(`/units/${id}`);
}

export function createUnit(customerId: string, input: UnitInput) {
  return api.post<Unit>(`/customers/${customerId}/units`, input);
}

export function updateUnit(id: string, input: Partial<UnitInput>) {
  return api.patch<Unit>(`/units/${id}`, input);
}

export function deleteUnit(id: string) {
  return api.delete<void>(`/units/${id}`);
}
