import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { PageLoading } from "./PageLoading.js";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

/** Nested inside RequireAuth: keeps the read-only CLIENT portal role out of the full admin UI. */
export function RequireAdminRole() {
  const { user } = useAuth();
  if (user?.role === "CLIENT") {
    return <Navigate to="/portal" replace />;
  }
  return <Outlet />;
}

/** Nested inside RequireAuth: keeps ADMIN users (who have no customerId) out of the client portal UI. */
export function RequirePortalRole() {
  const { user } = useAuth();
  if (user?.role !== "CLIENT") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
