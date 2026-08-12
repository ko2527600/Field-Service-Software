import type { ServiceLogInput } from "@firearmour/shared";
import { api } from "./client.js";
import type { ServiceLog } from "./types.js";

export function listServiceLogs(unitId: string) {
  return api.get<ServiceLog[]>(`/units/${unitId}/service-logs`);
}

export function createServiceLog(unitId: string, input: ServiceLogInput) {
  return api.post<ServiceLog>(`/units/${unitId}/service-logs`, input);
}

export function deleteServiceLog(id: string) {
  return api.delete<void>(`/service-logs/${id}`);
}
