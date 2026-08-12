import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/priority", label: "Priority", icon: "⏰" },
  { to: "/export", label: "Export", icon: "⬇" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-gray-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs ${
                  isActive ? "text-brand font-medium" : "text-gray-500"
                }`
              }
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
