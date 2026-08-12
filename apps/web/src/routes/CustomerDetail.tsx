import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteCustomer, getCustomer } from "../api/customers.js";
import type { CustomerWithUnits } from "../api/types.js";
import { UnitListItem } from "../components/UnitListItem.js";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerWithUnits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    if (!id) return;
    setLoading(true);
    getCustomer(id)
      .then(setCustomer)
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
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <p className="text-sm text-gray-500">{customer.businessType || "—"}</p>
        </div>
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
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm space-y-1">
        {customer.contactPhone && <div>📞 {customer.contactPhone}</div>}
        {customer.contactEmail && <div>✉️ {customer.contactEmail}</div>}
        {(customer.addressLine1 || customer.city) && (
          <div>
            📍 {[customer.addressLine1, customer.addressLine2, customer.city, customer.state, customer.postalCode]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
        {customer.notes && <div className="text-gray-500 pt-1">{customer.notes}</div>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Extinguishers ({customer.units.length})</h2>
          <Link to={`/customers/${customer.id}/units/new`} className="text-sm text-brand hover:underline">
            + Add Unit
          </Link>
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
    </div>
  );
}
