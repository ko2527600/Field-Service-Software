import type { DashboardSummary } from "../api/types.js";
import { XCircleIcon, AlertTriangleIcon, CheckCircleIcon, CustomersIcon } from "./icons/index.js";

export function DashboardSummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: "Expired", value: summary.expiredCount, style: "bg-red-50 text-red-700 border-red-200", Icon: XCircleIcon },
    {
      label: "Due Soon",
      value: summary.dueSoonCount,
      style: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: AlertTriangleIcon,
    },
    {
      label: "Active",
      value: summary.activeCount,
      style: "bg-green-50 text-green-700 border-green-200",
      Icon: CheckCircleIcon,
    },
    {
      label: "Customers",
      value: summary.totalCustomers,
      style: "bg-gray-50 text-gray-700 border-gray-200",
      Icon: CustomersIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-4 shadow-card ${card.style}`}>
          <card.Icon className="h-5 w-5 mb-1.5 opacity-70" strokeWidth={1.8} aria-hidden="true" />
          <div className="text-2xl font-extrabold tracking-tight">{card.value}</div>
          <div className="text-sm">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
