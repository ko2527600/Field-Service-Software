import { useOnlineStatus } from "../hooks/useOnlineStatus.js";
import { DownloadIcon, InvoiceIcon, CustomersIcon } from "../components/icons/index.js";
import { API_BASE } from "../api/client.js";

export default function Export() {
  const online = useOnlineStatus();

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-2">
        <DownloadIcon className="h-6 w-6 text-brand" strokeWidth={1.8} />
        <h1 className="text-xl font-extrabold tracking-tight">Export</h1>
      </div>
      <p className="text-sm text-gray-500">Download your data as a PDF any time — no paywalls, no lock-in.</p>

      {!online && <p className="text-sm text-amber-700">You're offline — reconnect to export.</p>}

      <div className="space-y-3">
        <a
          href={`${API_BASE}/export/units.pdf`}
          download
          className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-card hover:border-brand-100 hover:shadow-card-hover ${
            !online ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <InvoiceIcon className="h-6 w-6 text-brand shrink-0" strokeWidth={1.6} />
          <div>
            <div className="font-medium">Extinguishers &amp; Status</div>
            <div className="text-sm text-gray-500">
              Every unit with customer contact info, renewal date, and current status.
            </div>
          </div>
        </a>
        <a
          href={`${API_BASE}/export/customers.pdf`}
          download
          className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-card hover:border-brand-100 hover:shadow-card-hover ${
            !online ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <CustomersIcon className="h-6 w-6 text-brand shrink-0" strokeWidth={1.6} />
          <div>
            <div className="font-medium">Customers</div>
            <div className="text-sm text-gray-500">Contact details, location, and unit counts per customer.</div>
          </div>
        </a>
      </div>
    </div>
  );
}
