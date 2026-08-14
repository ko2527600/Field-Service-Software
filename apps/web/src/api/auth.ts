import type { LoginInput, RegisterInput, UserRole } from "@firearmour/shared";
import { api } from "./client.js";

export type AuthUser = { id: string; email: string; businessId: string; role: UserRole; customerId: string | null };

export function register(input: RegisterInput) {
  return api.post<AuthUser>("/auth/register", input);
}

export function login(input: LoginInput) {
  return api.post<AuthUser>("/auth/login", input);
}

export function logout() {
  return api.post<void>("/auth/logout", {});
}

export function getMe() {
  return api.get<AuthUser>("/auth/me");
}
