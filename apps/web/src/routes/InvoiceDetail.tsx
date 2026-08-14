import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteInvoice, getInvoice, invoicePdfUrl, createPaymentLink } from "../api/invoices.js";
import type { Invoice } from "../api/types.js";
import { DownloadIcon, CheckCircleIcon } from "../components/icons/index.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

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

  async function handleGeneratePaymentLink() {
    if (!id) return;
    setLinkError(null);
    setGeneratingLink(true);
    try {
      const updated = await createPaymentLink(id);
      setInvoice(updated);
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGeneratingLink(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!invoice) return null;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight">{invoice.invoiceNumber}</h1>
            {invoice.paymentStatus === "PAID" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">
                <CheckCircleIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-medium">
                Unpaid
              </span>
            )}
          </div>
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

      {invoice.paymentStatus !== "PAID" && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">MoMo Payment Link</h2>
          {invoice.paymentLink ? (
            <a href={invoice.paymentLink} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline break-all">
              {invoice.paymentLink}
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              Generate a secure link so this client can pay via MTN MoMo, Telecel Cash, or card.
            </p>
          )}
          <button
            onClick={handleGeneratePaymentLink}
            disabled={generatingLink || !online}
            className="rounded-lg border border-gray-300 text-sm font-medium px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
          >
            {generatingLink ? "Generating…" : invoice.paymentLink ? "Regenerate Link" : "Get MoMo Payment Link"}
          </button>
          {linkError && <p className="text-sm text-red-600">{linkError}</p>}
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
