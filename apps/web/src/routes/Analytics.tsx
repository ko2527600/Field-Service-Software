import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getAnalytics } from "../api/dashboard.js";
import type { DashboardAnalytics } from "../api/types.js";

// Matches the app's existing status palette (StatusBadge: green/amber/red for Active/Due Soon/Expired)
// so status meaning stays consistent across the whole app rather than introducing a second color language.
const STATUS_COLORS: Record<string, string> = {
  Active: "#16a34a",
  "Due Soon": "#d97706",
  Expired: "#dc2626",
};

// Revenue bars deliberately avoid green/amber/red so they never read as a status.
const ACTUAL_REVENUE_COLOR = "#2563eb";
const ESTIMATED_REVENUE_COLOR = "#9ca3af";

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function Analytics() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const pieData = [
    { name: "Active", value: data.statusBreakdown.ACTIVE },
    { name: "Due Soon", value: data.statusBreakdown.DUE_SOON },
    { name: "Expired", value: data.statusBreakdown.EXPIRED },
  ];
  const totalUnits = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">Fleet Compliance Analytics</h1>
        <p className="text-sm text-gray-500">
          A portfolio-level view across every client, ready for a GNFS conversation.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Compliance Status</h2>
        <p className="text-xs text-gray-500 mb-3">{totalUnits} extinguishers across your portfolio.</p>
        {totalUnits === 0 ? (
          <p className="text-sm text-gray-500">No extinguishers on file yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={32} />
              <Tooltip formatter={(value, name) => [`${value} units`, name]} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Actual Revenue (past 6 months)</h2>
        <p className="text-xs text-gray-500 mb-3">Total invoiced per month, from real invoice records.</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.actualRevenue} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={56} tickFormatter={money} />
            <Tooltip formatter={(value) => money(Number(value))} />
            <Bar dataKey="revenue" fill={ACTUAL_REVENUE_COLOR} radius={[4, 4, 0, 0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Estimated Renewal Revenue (next 6 months)</h2>
        <p className="text-xs text-gray-500 mb-3">
          Units due each month × your average historical service charge. An estimate, not a guarantee.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.upcomingRenewals} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={56} tickFormatter={money} />
            <Tooltip
              formatter={(value, _name, item) => [
                `${money(Number(value))} (~${item.payload.dueCount} units due)`,
                "Estimated revenue",
              ]}
            />
            <Bar dataKey="estimatedRevenue" fill={ESTIMATED_REVENUE_COLOR} radius={[4, 4, 0, 0]} name="Estimated revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
