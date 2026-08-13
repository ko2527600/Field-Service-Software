import { Link } from "react-router-dom";
import type { CustomerWithUnits } from "../api/types.js";
import { StatusBadge } from "./StatusBadge.js";
import { ChevronRightIcon } from "./icons/index.js";

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
      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover hover:border-brand-100"
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
      <div className="flex items-center gap-1.5 shrink-0">
        {worstStatus && <StatusBadge status={worstStatus} />}
        <ChevronRightIcon className="h-4 w-4 text-gray-300 hidden sm:block" strokeWidth={2} />
      </div>
    </Link>
  );
}
