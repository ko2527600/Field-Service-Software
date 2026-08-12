import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

export default function Export() {
  const online = useOnlineStatus();

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-xl font-semibold">Export</h1>
      <p className="text-sm text-gray-500">
        Download your data as a CSV any time — no paywalls, no lock-in.
      </p>

      {!online && <p className="text-sm text-amber-700">You're offline — reconnect to export.</p>}

      <div className="space-y-3">
        <a
          href="/api/v1/export/units.csv"
          download
          className={`block rounded-lg border border-gray-200 bg-white p-4 hover:border-brand ${
            !online ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="font-medium">Extinguishers &amp; Status</div>
          <div className="text-sm text-gray-500">
            Every unit with customer contact info, renewal date, and current status.
          </div>
        </a>
        <a
          href="/api/v1/export/customers.csv"
          download
          className={`block rounded-lg border border-gray-200 bg-white p-4 hover:border-brand ${
            !online ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="font-medium">Customers</div>
          <div className="text-sm text-gray-500">Contact details, location, and unit counts per customer.</div>
        </a>
      </div>
    </div>
  );
}
