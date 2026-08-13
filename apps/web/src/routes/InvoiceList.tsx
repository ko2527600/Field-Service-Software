import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listInvoices } from "../api/invoices.js";
import type { Invoice } from "../api/types.js";
import { InvoiceIcon, ChevronRightIcon } from "../components/icons/index.js";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <InvoiceIcon className="h-6 w-6 text-brand" strokeWidth={1.6} />
        <h1 className="text-xl font-extrabold tracking-tight">Invoices</h1>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-center py-10 text-gray-400">
          <InvoiceIcon className="h-10 w-10" strokeWidth={1.5} />
          <p className="text-sm">No invoices yet. Create one from a customer's page.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover hover:border-brand-100"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{invoice.invoiceNumber}</div>
                <div className="text-sm text-gray-500 truncate">{invoice.customer?.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold">${Number(invoice.total).toFixed(2)}</span>
                <ChevronRightIcon className="h-4 w-4 text-gray-300 hidden sm:block" strokeWidth={2} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
