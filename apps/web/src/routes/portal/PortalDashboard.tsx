import { useEffect, useState } from "react";
import { EXTINGUISHER_TYPE_LABELS } from "@firearmour/shared";
import { getPortalMe, getPortalUnits, type PortalMe } from "../../api/portal.js";
import type { Unit } from "../../api/types.js";
import { StatusBadge } from "../../components/StatusBadge.js";
import { MapPinIcon } from "../../components/icons/index.js";

export default function PortalDashboard() {
  const [me, setMe] = useState<PortalMe | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPortalMe(), getPortalUnits()])
      .then(([meRes, unitsRes]) => {
        setMe(meRes);
        setUnits(unitsRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const activeCount = units.filter((u) => u.status === "ACTIVE").length;
  const attentionCount = units.length - activeCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">{me?.customer.name}</h1>
        <p className="text-sm text-gray-500">Fire safety compliance status, courtesy of {me?.businessName}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
          <div className="text-2xl font-extrabold text-green-700">{activeCount}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card">
          <div className="text-2xl font-extrabold text-red-700">{attentionCount}</div>
          <div className="text-sm text-gray-500">Needs attention</div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Your Extinguishers ({units.length})</h2>
        {units.length === 0 ? (
          <p className="text-sm text-gray-500">No extinguishers on file yet.</p>
        ) : (
          <div className="space-y-2">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm">
                      {EXTINGUISHER_TYPE_LABELS[unit.type]} · {unit.size}
                    </div>
                    {unit.location && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPinIcon className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.8} />
                        {unit.location}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">SN {unit.serialNumber}</div>
                  </div>
                  <StatusBadge status={unit.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
