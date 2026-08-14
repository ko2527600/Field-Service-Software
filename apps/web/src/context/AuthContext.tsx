import { createContext, useEffect, useState, type ReactNode } from "react";
import type { LoginInput, RegisterInput } from "@firearmour/shared";
import * as authApi from "../api/auth.js";
import type { AuthUser } from "../api/auth.js";
import { setUnauthorizedHandler } from "../api/client.js";

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    authApi
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(input: LoginInput) {
    const authedUser = await authApi.login(input);
    setUser(authedUser);
    return authedUser;
  }

  async function register(input: RegisterInput) {
    const authedUser = await authApi.register(input);
    setUser(authedUser);
    return authedUser;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}
