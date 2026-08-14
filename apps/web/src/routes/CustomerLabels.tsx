import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { EXTINGUISHER_TYPE_LABELS } from "@firearmour/shared";
import { getCustomer } from "../api/customers.js";
import type { CustomerWithUnits } from "../api/types.js";
import { Logo } from "../components/Logo.js";
import { ChevronRightIcon } from "../components/icons/index.js";

export default function CustomerLabels() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerWithUnits | null>(null);
  const [qrByUnit, setQrByUnit] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCustomer(id)
      .then(setCustomer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    Promise.all(
      customer.units.map(async (unit) => {
        const deepLink = `${window.location.origin}/units/${unit.id}`;
        const dataUrl = await QRCode.toDataURL(deepLink, { width: 160, margin: 1 }).catch(() => null);
        return [unit.id, dataUrl] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setQrByUnit(Object.fromEntries(entries.filter(([, url]) => url) as [string, string][]));
    });
    return () => {
      cancelled = true;
    };
  }, [customer]);

  if (loading) return <p className="p-4 text-gray-500">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white p-4">
      <div className="print:hidden flex items-center justify-between max-w-3xl mx-auto mb-4">
        <Link to={`/customers/${customer.id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronRightIcon className="h-4 w-4 rotate-180" strokeWidth={2} />
          Back to {customer.name}
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark"
        >
          Print All Labels
        </button>
      </div>

      <h1 className="print:hidden text-xl font-extrabold tracking-tight max-w-3xl mx-auto mb-1">
        {customer.name} — Labels ({customer.units.length})
      </h1>
      <p className="print:hidden text-sm text-gray-500 max-w-3xl mx-auto mb-4">
        Cut along the borders after printing. Each label links straight to that unit's record.
      </p>

      {customer.units.length === 0 ? (
        <p className="text-sm text-gray-500 max-w-3xl mx-auto">No extinguishers recorded for this customer yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {customer.units.map((unit) => (
            <div
              key={unit.id}
              className="print:break-inside-avoid bg-white border border-gray-300 rounded-lg shadow-card print:shadow-none p-3 flex items-center gap-3"
            >
              <img src={qrByUnit[unit.id] ?? ""} alt="Scannable QR code" className="h-20 w-20 shrink-0" />
              <div className="min-w-0 flex flex-col justify-center gap-0.5">
                <div className="flex items-center gap-1">
                  <Logo className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[8px] font-bold tracking-tight text-gray-500 uppercase">Fire Armour</span>
                </div>
                <div className="font-bold text-xs leading-tight">{EXTINGUISHER_TYPE_LABELS[unit.type]}</div>
                <div className="text-[10px] text-gray-600">{unit.size}</div>
                <div className="text-[10px] font-mono font-bold mt-0.5">SN {unit.serialNumber}</div>
                {unit.location && <div className="text-[9px] text-gray-500 truncate">{unit.location}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
