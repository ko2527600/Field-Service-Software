import type { DashboardSummary } from "../api/types.js";

export function DashboardSummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: "Expired", value: summary.expiredCount, style: "bg-red-50 text-red-700 border-red-200" },
    { label: "Due Soon", value: summary.dueSoonCount, style: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Active", value: summary.activeCount, style: "bg-green-50 text-green-700 border-green-200" },
    { label: "Customers", value: summary.totalCustomers, style: "bg-gray-50 text-gray-700 border-gray-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-4 ${card.style}`}>
          <div className="text-2xl font-semibold">{card.value}</div>
          <div className="text-sm">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
