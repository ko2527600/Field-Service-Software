import { Outlet } from "react-router-dom";
import { SideNav } from "./nav/SideNav.js";
import { BottomNav } from "./nav/BottomNav.js";
import { OfflineBanner } from "./OfflineBanner.js";
import { InstallPromptButton } from "./InstallPromptButton.js";

export function Layout() {
  return (
    <div className="md:flex min-h-screen">
      <SideNav />
      <div className="flex-1 flex flex-col min-w-0">
        <OfflineBanner />
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🧯
            </span>
            <span className="font-semibold">Ledgio</span>
          </div>
          <InstallPromptButton />
        </header>
        <div className="hidden md:flex md:justify-end md:px-6 md:pt-4">
          <InstallPromptButton />
        </div>
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
