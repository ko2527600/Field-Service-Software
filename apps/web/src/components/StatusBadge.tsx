import { UNIT_STATUS_LABELS, type UnitStatus } from "@firearmour/shared";
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from "./icons/index.js";

const STYLES: Record<UnitStatus, string> = {
  ACTIVE: "bg-success-100 text-green-800",
  DUE_SOON: "bg-warning-100 text-amber-800",
  EXPIRED: "bg-danger-100 text-red-800",
};

const ICONS: Record<UnitStatus, typeof CheckCircleIcon> = {
  ACTIVE: CheckCircleIcon,
  DUE_SOON: AlertTriangleIcon,
  EXPIRED: XCircleIcon,
};

export function StatusBadge({ status }: { status: UnitStatus }) {
  const Icon = ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
      {UNIT_STATUS_LABELS[status]}
    </span>
  );
}
