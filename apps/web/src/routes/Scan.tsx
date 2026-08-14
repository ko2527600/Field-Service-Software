import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getUnitBySerial } from "../api/units.js";
import { ScanIcon } from "../components/icons/index.js";

const SCANNER_ELEMENT_ID = "unit-qr-scanner";

/** Extracts a unit id from a scanned FireArmour deep link (e.g. https://app/units/<id>), or returns the raw text for a serial-number fallback lookup. */
function parseUnitId(decodedText: string): string | null {
  try {
    const url = new URL(decodedText);
    const match = url.pathname.match(/\/units\/([^/]+)/);
    return match?.[1] ?? null;
  } catch {
    const match = decodedText.match(/^\/units\/([^/]+)$/);
    return match?.[1] ?? null;
  }
}

export default function Scan() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      SCANNER_ELEMENT_ID,
      { fps: 10, qrbox: { width: 220, height: 220 } },
      false,
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        if (resolvedRef.current) return;
        resolvedRef.current = true;
        void handleScan(decodedText);
      },
      () => {
        // ignore per-frame "no QR code found" callbacks
      },
    );

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleScan(decodedText: string) {
    setResolving(true);
    setError(null);
    try {
      const unitId = parseUnitId(decodedText);
      if (unitId) {
        navigate(`/units/${unitId}`);
        return;
      }
      const unit = await getUnitBySerial(decodedText.trim());
      navigate(`/units/${unit.id}`);
    } catch {
      setError("No extinguisher found for that code. Try scanning again.");
      setResolving(false);
      resolvedRef.current = false;
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-2">
        <ScanIcon className="h-6 w-6 text-brand" strokeWidth={1.8} />
        <h1 className="text-xl font-extrabold tracking-tight">Scan Extinguisher</h1>
      </div>
      <p className="text-sm text-gray-500">
        Point your camera at the QR code or barcode on the extinguisher to pull up its record.
      </p>

      {resolving && <p className="text-sm text-gray-500">Looking up unit…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div id={SCANNER_ELEMENT_ID} className="rounded-lg overflow-hidden" />
    </div>
  );
}
