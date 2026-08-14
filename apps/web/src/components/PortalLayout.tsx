import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "./Logo.js";
import { LogoutButton } from "./LogoutButton.js";
import { HomeIcon, InvoiceIcon } from "./icons/index.js";

const items = [
  { to: "/portal", label: "Compliance Status", Icon: HomeIcon },
  { to: "/portal/invoices", label: "Invoices", Icon: InvoiceIcon },
];

export function PortalLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-extrabold tracking-tight">Fire Armour</span>
        </div>
        <LogoutButton />
      </header>
      <nav className="flex gap-1 border-b border-gray-200 bg-white px-4 md:px-6">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/portal"}
            className={({ isActive }) =>
              `flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors ${
                isActive ? "border-brand text-brand font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="max-w-3xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
