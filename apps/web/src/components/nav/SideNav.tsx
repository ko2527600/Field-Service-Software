import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/priority", label: "Priority List", icon: "⏰" },
  { to: "/export", label: "Export", icon: "⬇" },
];

export function SideNav() {
  return (
    <nav className="hidden md:flex md:flex-col md:w-56 md:shrink-0 md:border-r md:border-gray-200 md:bg-white md:h-screen md:sticky md:top-0 md:p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-xl" aria-hidden="true">
          🧯
        </span>
        <span className="font-semibold text-lg">Fire Armour</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-red-50 text-brand font-medium" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
