import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteCustomer, getCustomer, getPortalAccess } from "../api/customers.js";
import { listInvoices } from "../api/invoices.js";
import type { CustomerWithUnits, Invoice } from "../api/types.js";
import type { PortalAccess } from "../api/customers.js";
import { UnitListItem } from "../components/UnitListItem.js";
import { PortalAccessPanel } from "../components/PortalAccessPanel.js";
import { PhoneIcon, MailIcon, MapPinIcon, PlusIcon, InvoiceIcon, ChevronRightIcon } from "../components/icons/index.js";
import { useAuth } from "../hooks/useAuth.js";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [customer, setCustomer] = useState<CustomerWithUnits | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalAccess, setPortalAccess] = useState<PortalAccess | null>(null);

  function reload() {
    if (!id) return;
    setLoading(true);
    // Invoicing and portal-access management are admin-only endpoints -- a
    // technician calling them would just get a 403, so skip the requests entirely.
    Promise.all([
      getCustomer(id),
      isAdmin ? listInvoices({ customerId: id }) : Promise.resolve([]),
      isAdmin ? getPortalAccess(id) : Promise.resolve(null),
    ])
      .then(([c, inv, access]) => {
        setCustomer(c);
        setInvoices(inv);
        setPortalAccess(access);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(reload, [id]);

  async function handleDelete() {
    if (!id || !confirm("Archive this customer? Their units and history are kept but hidden.")) return;
    await deleteCustomer(id);
    navigate("/customers");
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{customer.name}</h1>
          <p className="text-sm text-gray-500">{customer.businessType || "—"}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Link
              to={`/customers/${customer.id}/edit`}
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
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-2 shadow-card">
        {customer.contactPhone && (
          <div className="flex items-center gap-2 text-gray-700">
            <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={1.8} />
            {customer.contactPhone}
          </div>
        )}
        {customer.contactEmail && (
          <div className="flex items-center gap-2 text-gray-700">
            <MailIcon className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={1.8} />
            {customer.contactEmail}
          </div>
        )}
        {(customer.addressLine1 || customer.city) && (
          <div className="flex items-center gap-2 text-gray-700">
            <MapPinIcon className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={1.8} />
            {[customer.addressLine1, customer.addressLine2, customer.city, customer.state, customer.postalCode]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
        {customer.notes && <div className="text-gray-500 pt-1">{customer.notes}</div>}
      </div>

      {isAdmin && portalAccess && (
        <PortalAccessPanel customerId={customer.id} access={portalAccess} onCreated={setPortalAccess} />
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Extinguishers ({customer.units.length})</h2>
          <div className="flex items-center gap-3">
            {customer.units.length > 0 && (
              <Link
                to={`/customers/${customer.id}/labels`}
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                Print Labels
              </Link>
            )}
            {isAdmin && (
              <Link
                to={`/customers/${customer.id}/units/new`}
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                Add Unit
              </Link>
            )}
          </div>
        </div>
        {customer.units.length === 0 ? (
          <p className="text-sm text-gray-500">No units recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {customer.units.map((unit) => (
              <UnitListItem key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-700">Invoices ({invoices.length})</h2>
            <Link
              to={`/customers/${customer.id}/invoices/new`}
              className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
            >
              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
              New Invoice
            </Link>
          </div>
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500">No invoices yet.</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  to={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-card hover:shadow-card-hover hover:border-brand-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <InvoiceIcon className="h-4 w-4 text-brand shrink-0" strokeWidth={1.8} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium text-sm">${Number(invoice.total).toFixed(2)}</span>
                    <ChevronRightIcon className="h-4 w-4 text-gray-300" strokeWidth={2} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
