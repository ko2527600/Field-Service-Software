import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSummary, getPriorityList } from "../api/dashboard.js";
import type { DashboardSummary, Unit } from "../api/types.js";
import { DashboardSummaryCards } from "../components/DashboardSummaryCards.js";
import { UnitListItem } from "../components/UnitListItem.js";
import { HeroBanner } from "../components/HeroBanner.js";
import { FooterBand } from "../components/FooterBand.js";
import { PlusIcon, ChartIcon } from "../components/icons/index.js";
import { useAuth } from "../hooks/useAuth.js";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [priority, setPriority] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSummary(), getPriorityList(5)])
      .then(([s, p]) => {
        setSummary(s);
        setPriority(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <HeroBanner />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-extrabold tracking-tight">Dashboard</h1>
          {isAdmin && (
            <Link to="/analytics" className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
              <ChartIcon className="h-4 w-4" strokeWidth={1.8} />
              Fleet Analytics
            </Link>
          )}
        </div>
        {summary && <DashboardSummaryCards summary={summary} />}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Contact soonest</h2>
          <Link to="/priority" className="text-sm text-brand hover:underline">
            View full list
          </Link>
        </div>
        {priority.length === 0 ? (
          <p className="text-sm text-gray-500">No units yet. Add a customer to get started.</p>
        ) : (
          <div className="space-y-2">
            {priority.map((unit) => (
              <UnitListItem key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <Link
          to="/customers/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
          Add Customer
        </Link>
      )}

      <FooterBand />
    </div>
  );
}
