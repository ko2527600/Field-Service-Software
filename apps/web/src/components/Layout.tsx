import { Outlet, Link } from "react-router-dom";
import { SideNav } from "./nav/SideNav.js";
import { BottomNav } from "./nav/BottomNav.js";
import { OfflineBanner } from "./OfflineBanner.js";
import { InstallPromptButton } from "./InstallPromptButton.js";
import { Logo } from "./Logo.js";
import { LogoutButton } from "./LogoutButton.js";
import { SettingsIcon } from "./icons/index.js";
import { useAuth } from "../hooks/useAuth.js";

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="md:flex min-h-screen bg-gray-50">
      <SideNav />
      <div className="flex-1 flex flex-col min-w-0">
        <OfflineBanner />
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-extrabold tracking-tight">Fire Armour</span>
          </div>
          <div className="flex items-center gap-1">
            <InstallPromptButton />
            {user?.role === "ADMIN" && (
              <Link
                to="/settings"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="Settings"
              >
                <SettingsIcon className="h-5 w-5" strokeWidth={1.8} />
              </Link>
            )}
            <LogoutButton compact />
          </div>
        </header>
        <div className="hidden md:flex md:items-center md:justify-end md:gap-3 md:px-6 md:pt-4">
          <InstallPromptButton />
          <LogoutButton />
        </div>
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
