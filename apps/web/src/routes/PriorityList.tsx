import { useEffect, useState } from "react";
import type { UnitStatus } from "@ledgio/shared";
import { listUnits } from "../api/units.js";
import type { Unit } from "../api/types.js";
import { UnitListItem } from "../components/UnitListItem.js";
import { FilterSortBar, type SortOption } from "../components/FilterSortBar.js";

export default function PriorityList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [status, setStatus] = useState<UnitStatus | "">("");
  const [sort, setSort] = useState<SortOption>("renewalDate:asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listUnits({ status: status || undefined, sort })
      .then(setUnits)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, sort]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Priority List</h1>
      <p className="text-sm text-gray-500">Who to contact first, sorted by nearest due date.</p>

      <FilterSortBar status={status} onStatusChange={setStatus} sort={sort} onSortChange={setSort} />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : units.length === 0 ? (
        <p className="text-gray-500 text-sm">No units match this filter.</p>
      ) : (
        <div className="space-y-2">
          {units.map((unit) => (
            <UnitListItem key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
