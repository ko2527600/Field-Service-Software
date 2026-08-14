import { NavLink } from "react-router-dom";
import { Logo } from "../Logo.js";
import { useAuth } from "../../hooks/useAuth.js";
import {
  HomeIcon,
  CustomersIcon,
  ClockIcon,
  DownloadIcon,
  InvoiceIcon,
  SettingsIcon,
  ScanIcon,
  ChartIcon,
} from "../icons/index.js";

const items = [
  { to: "/", label: "Dashboard", Icon: HomeIcon, adminOnly: false },
  { to: "/customers", label: "Customers", Icon: CustomersIcon, adminOnly: false },
  { to: "/priority", label: "Priority List", Icon: ClockIcon, adminOnly: false },
  { to: "/scan", label: "Scan", Icon: ScanIcon, adminOnly: false },
  { to: "/invoices", label: "Invoices", Icon: InvoiceIcon, adminOnly: true },
  { to: "/analytics", label: "Analytics", Icon: ChartIcon, adminOnly: true },
  { to: "/export", label: "Export", Icon: DownloadIcon, adminOnly: true },
];

export function SideNav() {
  const { user } = useAuth();
  const visibleItems = items.filter((item) => !item.adminOnly || user?.role === "ADMIN");

  return (
    <nav className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:border-r md:border-gray-200 md:bg-white md:h-screen md:sticky md:top-0 md:p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Logo className="h-9 w-9" />
        <span className="font-extrabold tracking-tight text-lg">Fire Armour</span>
      </div>
      <ul className="space-y-1 flex-1">
        {visibleItems.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-brand-50 text-brand font-medium" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      {user?.role === "ADMIN" && (
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-brand-50 text-brand font-medium" : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <SettingsIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          Settings
        </NavLink>
      )}
    </nav>
  );
}
