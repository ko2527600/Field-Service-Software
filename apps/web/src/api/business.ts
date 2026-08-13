import type { BusinessProfileInput } from "@firearmour/shared";
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
  createdAt: string;
};

export function getBusinessProfile() {
  return api.get<Business>("/business");
}

export function updateBusinessProfile(input: BusinessProfileInput) {
  return api.patch<Business>("/business", input);
}
