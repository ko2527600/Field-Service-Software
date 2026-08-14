import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { EXTINGUISHER_TYPE_LABELS } from "@firearmour/shared";
import { getUnit } from "../api/units.js";
import type { UnitWithLogs } from "../api/types.js";
import { Logo } from "../components/Logo.js";
import { ChevronRightIcon } from "../components/icons/index.js";

export default function UnitLabel() {
  const { id } = useParams();
  const [unit, setUnit] = useState<UnitWithLogs | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getUnit(id)
      .then(setUnit)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!unit) return;
    const deepLink = `${window.location.origin}/units/${unit.id}`;
    QRCode.toDataURL(deepLink, { width: 320, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [unit]);

  if (loading) return <p className="p-4 text-gray-500">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!unit) return null;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <style>{`@media print { @page { size: 3in 2in; margin: 0; } }`}</style>

      <div className="print:hidden flex items-center justify-between p-4 max-w-md mx-auto">
        <Link to={`/units/${unit.id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronRightIcon className="h-4 w-4 rotate-180" strokeWidth={2} />
          Back to unit
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark"
        >
          Print Label
        </button>
      </div>

      <div className="flex justify-center p-4 print:p-0">
        <div className="w-[3in] h-[2in] bg-white border border-gray-300 print:border-0 rounded-lg print:rounded-none shadow-card print:shadow-none flex items-center gap-3 p-3">
          <img src={qrDataUrl ?? ""} alt="Scannable QR code" className="h-[1.6in] w-[1.6in] shrink-0" />
          <div className="min-w-0 flex flex-col justify-center gap-0.5">
            <div className="flex items-center gap-1">
              <Logo className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-bold tracking-tight text-gray-500 uppercase">Fire Armour</span>
            </div>
            <div className="font-extrabold text-sm leading-tight break-words">
              {EXTINGUISHER_TYPE_LABELS[unit.type]}
            </div>
            <div className="text-xs text-gray-600">{unit.size}</div>
            <div className="text-xs font-mono font-bold mt-1">SN {unit.serialNumber}</div>
            {unit.customerName && <div className="text-[10px] text-gray-500 truncate">{unit.customerName}</div>}
            {unit.location && <div className="text-[10px] text-gray-500 truncate">{unit.location}</div>}
          </div>
        </div>
      </div>

      <p className="print:hidden text-center text-xs text-gray-400 max-w-md mx-auto px-4">
        Sized for a 3&times;2 in label. Use your printer's label/sticker setting, or "Save as PDF" and print
        onto adhesive label sheets.
      </p>
    </div>
  );
}
