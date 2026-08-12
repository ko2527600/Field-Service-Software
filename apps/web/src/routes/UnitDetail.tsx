import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EXTINGUISHER_TYPE_LABELS, RENEWAL_PERIOD_LABELS } from "@ledgio/shared";
import { deleteUnit, getUnit } from "../api/units.js";
import type { UnitWithLogs } from "../api/types.js";
import { StatusBadge } from "../components/StatusBadge.js";

export default function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<UnitWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    if (!id) return;
    setLoading(true);
    getUnit(id)
      .then(setUnit)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  async function handleDelete() {
    if (!id || !unit || !confirm("Archive this extinguisher? Its service history is kept but hidden.")) return;
    await deleteUnit(id);
    navigate(`/customers/${unit.customerId}`);
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!unit) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {EXTINGUISHER_TYPE_LABELS[unit.type]} · {unit.size}
          </h1>
          {unit.customerName && (
            <Link to={`/customers/${unit.customerId}`} className="text-sm text-brand hover:underline">
              {unit.customerName}
            </Link>
          )}
        </div>
        <StatusBadge status={unit.status} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-1">
        <div>Serial: {unit.serialNumber}</div>
        <div>Location: {unit.location || "—"}</div>
        <div>Installed: {new Date(unit.installDate).toLocaleDateString()}</div>
        <div>Renewal period: {RENEWAL_PERIOD_LABELS[unit.renewalPeriod]}</div>
        <div>Next due: {new Date(unit.renewalDate).toLocaleDateString()}</div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/units/${unit.id}/service/new`}
          className="rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 hover:bg-brand-dark"
        >
          Log Service Visit
        </Link>
        <Link
          to={`/units/${unit.id}/edit`}
          className="rounded-lg border border-gray-300 text-sm font-medium px-3 py-1.5 hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-300 text-red-600 text-sm font-medium px-3 py-1.5 hover:bg-red-50"
        >
          Archive
        </button>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Service History ({unit.serviceLogs.length})</h2>
        {unit.serviceLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No service visits logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {unit.serviceLogs.map((log) => (
              <li key={log.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{new Date(log.serviceDate).toLocaleDateString()}</span>
                  {log.amountCharged && <span>${Number(log.amountCharged).toFixed(2)}</span>}
                </div>
                {log.technician && <div className="text-gray-500">Technician: {log.technician}</div>}
                <div className="text-gray-500">Next due: {new Date(log.nextDueDate).toLocaleDateString()}</div>
                {log.notes && <div className="text-gray-500 mt-1">{log.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
