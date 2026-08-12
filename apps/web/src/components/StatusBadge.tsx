import { UNIT_STATUS_LABELS, type UnitStatus } from "@ledgio/shared";

const STYLES: Record<UnitStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  DUE_SOON: "bg-amber-100 text-amber-800",
  EXPIRED: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: UnitStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {UNIT_STATUS_LABELS[status]}
    </span>
  );
}
