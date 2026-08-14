import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { EXTINGUISHER_TYPE_LABELS, RENEWAL_PERIOD_LABELS } from "@firearmour/shared";
import { deleteUnit, getUnit } from "../api/units.js";
import type { UnitWithLogs } from "../api/types.js";
import { StatusBadge } from "../components/StatusBadge.js";
import { PlusIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "../components/icons/index.js";
import { useAuth } from "../hooks/useAuth.js";

export default function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const offlineSaved = Boolean((location.state as { offlineSaved?: boolean } | null)?.offlineSaved);
  const [unit, setUnit] = useState<UnitWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  function reload() {
    if (!id) return;
    setLoading(true);
    getUnit(id)
      .then(setUnit)
      .catch((err) => {
        if (!navigator.onLine) {
          setError("You're offline and this extinguisher hasn't been viewed on this device before, so it isn't available offline yet.");
          return;
        }
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  useEffect(() => {
    if (!unit) return;
    const deepLink = `${window.location.origin}/units/${unit.id}`;
    QRCode.toDataURL(deepLink, { width: 160, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [unit]);

  async function handleDelete() {
    if (!id || !unit || !confirm("Archive this extinguisher? Its service history is kept but hidden.")) return;
    await deleteUnit(id);
    navigate(`/customers/${unit.customerId}`);
  }

  const offlineSavedBanner = offlineSaved && (
    <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-3 py-2">
      Saved offline — this visit will sync automatically once you're back online.
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {offlineSavedBanner}
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-4">
        {offlineSavedBanner}
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  if (!unit) return offlineSavedBanner || null;

  return (
    <div className="space-y-6">
      {offlineSavedBanner}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
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

      {qrDataUrl && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card flex items-center gap-4">
          <img src={qrDataUrl} alt="Scannable QR code for this extinguisher" className="h-24 w-24" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">
              Print and affix this QR code to the unit. Technicians can scan it in the field to pull up this
              record instantly.
            </p>
            <Link to={`/units/${unit.id}/label`} className="inline-block mt-1 text-sm text-brand hover:underline">
              Print Label →
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-2 shadow-card">
        <div className="flex justify-between">
          <span className="text-gray-500">Serial</span>
          <span className="font-medium">{unit.serialNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
            Location
          </span>
          <span className="font-medium">{unit.location || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Installed</span>
          <span className="font-medium">{new Date(unit.installDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Renewal period</span>
          <span className="font-medium">{RENEWAL_PERIOD_LABELS[unit.renewalPeriod]}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
          <span className="text-gray-500 flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
            Next due
          </span>
          <span className="font-bold">{new Date(unit.renewalDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to={`/units/${unit.id}/service/new`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 shadow-card hover:bg-brand-dark"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
          Log Service Visit
        </Link>
        {isAdmin && (
          <>
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
          </>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Service History ({unit.serviceLogs.length})</h2>
        {unit.serviceLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No service visits logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {unit.serviceLogs.map((log) => (
              <li key={log.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-card">
                <div className="flex justify-between">
                  <span className="font-medium">{new Date(log.serviceDate).toLocaleDateString()}</span>
                  {log.amountCharged && <span>${Number(log.amountCharged).toFixed(2)}</span>}
                </div>
                {log.technician && <div className="text-gray-500">Technician: {log.technician}</div>}
                <div className="text-gray-500">Next due: {new Date(log.nextDueDate).toLocaleDateString()}</div>
                {log.notes && <div className="text-gray-500 mt-1">{log.notes}</div>}
                {log.locationCapturedAt && log.latitude != null && log.longitude != null && (
                  <div className="text-emerald-700 mt-1 text-xs flex items-center gap-1">
                    <CheckCircleIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    Verified on-site · {log.latitude.toFixed(5)}, {log.longitude.toFixed(5)} ·{" "}
                    {new Date(log.locationCapturedAt).toLocaleString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
