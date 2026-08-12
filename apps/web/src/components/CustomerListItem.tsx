import { Link } from "react-router-dom";
import type { CustomerWithUnits } from "../api/types.js";
import { StatusBadge } from "./StatusBadge.js";

export function CustomerListItem({ customer }: { customer: CustomerWithUnits }) {
  const worstStatus = customer.units.reduce<null | "EXPIRED" | "DUE_SOON" | "ACTIVE">((worst, unit) => {
    if (unit.status === "EXPIRED") return "EXPIRED";
    if (unit.status === "DUE_SOON" && worst !== "EXPIRED") return "DUE_SOON";
    if (!worst) return unit.status;
    return worst;
  }, null);

  return (
    <Link
      to={`/customers/${customer.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-brand"
    >
      <div className="min-w-0">
        <div className="font-medium truncate">{customer.name}</div>
        <div className="text-sm text-gray-500 truncate">
          {[customer.city, customer.state].filter(Boolean).join(", ") || customer.businessType || "—"}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {customer.unitCount ?? customer.units.length} unit
          {(customer.unitCount ?? customer.units.length) === 1 ? "" : "s"}
        </div>
      </div>
      {worstStatus && <StatusBadge status={worstStatus} />}
    </Link>
  );
}
