import { useEffect, useState } from "react";
import { getPortalInvoices, portalInvoicePdfUrl } from "../../api/portal.js";
import type { Invoice } from "../../api/types.js";
import { DownloadIcon } from "../../components/icons/index.js";

export default function PortalInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortalInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold tracking-tight">Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500">No invoices yet.</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <a
              key={invoice.id}
              href={portalInvoicePdfUrl(invoice.id)}
              download
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-card hover:shadow-card-hover hover:border-brand-100"
            >
              <div>
                <div className="font-medium text-sm">{invoice.invoiceNumber}</div>
                <div className="text-xs text-gray-400">{new Date(invoice.issueDate).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-medium text-sm">${Number(invoice.total).toFixed(2)}</span>
                <DownloadIcon className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
