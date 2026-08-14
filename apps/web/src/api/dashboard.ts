import { api } from "./client.js";
import type { DashboardAnalytics, DashboardSummary, Unit } from "./types.js";

export function getSummary() {
  return api.get<DashboardSummary>("/dashboard/summary");
}

export function getPriorityList(limit?: number) {
  const suffix = limit ? `?limit=${limit}` : "";
  return api.get<Unit[]>(`/dashboard/priority-list${suffix}`);
}

export function getAnalytics() {
  return api.get<DashboardAnalytics>("/dashboard/analytics");
}
