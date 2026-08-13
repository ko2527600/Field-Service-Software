import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LogoutIcon } from "./icons/index.js";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <button
      onClick={handleLogout}
      className={
        compact
          ? "flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100"
          : "flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
      }
      aria-label="Log out"
    >
      <LogoutIcon className={compact ? "h-5 w-5" : "h-4 w-4"} strokeWidth={1.8} />
      {!compact && "Log out"}
    </button>
  );
}
