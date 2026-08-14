import { NavLink } from "react-router-dom";
import { HomeIcon, CustomersIcon, ClockIcon, InvoiceIcon, DownloadIcon, ScanIcon } from "../icons/index.js";

const items = [
  { to: "/", label: "Home", Icon: HomeIcon },
  { to: "/customers", label: "Customers", Icon: CustomersIcon },
  { to: "/priority", label: "Priority", Icon: ClockIcon },
  { to: "/scan", label: "Scan", Icon: ScanIcon },
  { to: "/invoices", label: "Invoices", Icon: InvoiceIcon },
  { to: "/export", label: "Export", Icon: DownloadIcon },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                  isActive ? "text-brand font-medium" : "text-gray-500"
                }`
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
