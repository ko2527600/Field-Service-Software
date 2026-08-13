import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteInvoice, getInvoice, invoicePdfUrl } from "../api/invoices.js";
import type { Invoice } from "../api/types.js";
import { DownloadIcon } from "../components/icons/index.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getInvoice(id)
      .then(setInvoice)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id || !confirm("Delete this invoice? This can't be undone.")) return;
    await deleteInvoice(id);
    navigate("/invoices");
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!invoice) return null;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{invoice.invoiceNumber}</h1>
          {invoice.customer && (
            <Link to={`/customers/${invoice.customerId}`} className="text-sm text-brand hover:underline">
              {invoice.customer.name}
            </Link>
          )}
        </div>
        <span className="text-2xl font-extrabold">${Number(invoice.total).toFixed(2)}</span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-2 shadow-card">
        <div className="flex justify-between">
          <span className="text-gray-500">Issued</span>
          <span className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Due</span>
          <span className="font-medium">
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Line Items</h2>
        <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 shadow-card">
          {invoice.lineItems?.map((item) => (
            <div key={item.id} className="flex justify-between p-3 text-sm">
              <div>
                <div className="font-medium">{item.description}</div>
                {item.serviceType && <div className="text-gray-500 text-xs">{item.serviceType}</div>}
                <div className="text-gray-400 text-xs">
                  {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                </div>
              </div>
              <span className="font-medium">${Number(item.lineTotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-3 pt-2 text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>${Number(invoice.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between px-3 pt-1 font-bold">
          <span>Total</span>
          <span>${Number(invoice.total).toFixed(2)}</span>
        </div>
      </div>

      {invoice.notes && (
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">Notes: </span>
          {invoice.notes}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <a
          href={invoicePdfUrl(invoice.id)}
          download
          className={`inline-flex items-center gap-1.5 rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 shadow-card hover:bg-brand-dark ${
            !online ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <DownloadIcon className="h-4 w-4" strokeWidth={2} />
          Download PDF
        </a>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-red-300 text-red-600 text-sm font-medium px-3 py-1.5 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
