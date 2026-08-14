import type { BusinessProfileInput, SmsGateway } from "@firearmour/shared";
import { api } from "./client.js";

export type Business = {
  id: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  email2: string | null;
  smsRemindersEnabled: boolean;
  smsReminderDaysBefore: number;
  smsGateway: SmsGateway;
  createdAt: string;
};

export function getBusinessProfile() {
  return api.get<Business>("/business");
}

export function updateBusinessProfile(input: BusinessProfileInput) {
  return api.patch<Business>("/business", input);
}

export type StaffMember = { id: string; email: string; createdAt: string };
export type StaffInvited = { id: string; email: string; temporaryPassword: string };

export function listStaff() {
  return api.get<StaffMember[]>("/business/staff");
}

export function inviteStaff(email: string) {
  return api.post<StaffInvited>("/business/staff", { email });
}

export function revokeStaff(id: string) {
  return api.delete<void>(`/business/staff/${id}`);
}
