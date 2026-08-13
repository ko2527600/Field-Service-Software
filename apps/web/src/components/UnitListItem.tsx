import { Link } from "react-router-dom";
import { EXTINGUISHER_TYPE_LABELS } from "@firearmour/shared";
import type { Unit } from "../api/types.js";
import { StatusBadge } from "./StatusBadge.js";
import { ChevronRightIcon } from "./icons/index.js";

export function UnitListItem({ unit }: { unit: Unit }) {
  return (
    <Link
      to={`/units/${unit.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover hover:border-brand-100"
    >
      <div className="min-w-0">
        <div className="font-medium truncate">
          {EXTINGUISHER_TYPE_LABELS[unit.type]} · {unit.size}
        </div>
        {unit.customerName && <div className="text-sm text-gray-500 truncate">{unit.customerName}</div>}
        <div className="text-xs text-gray-400 mt-0.5">
          Due {new Date(unit.renewalDate).toLocaleDateString()} · SN {unit.serialNumber}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <StatusBadge status={unit.status} />
        <ChevronRightIcon className="h-4 w-4 text-gray-300 hidden sm:block" strokeWidth={2} />
      </div>
    </Link>
  );
}
