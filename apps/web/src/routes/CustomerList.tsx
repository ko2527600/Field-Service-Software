import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCustomers } from "../api/customers.js";
import type { CustomerWithUnits } from "../api/types.js";
import { CustomerListItem } from "../components/CustomerListItem.js";
import { SearchInput } from "../components/SearchInput.js";

export default function CustomerList() {
  const [customers, setCustomers] = useState<CustomerWithUnits[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listCustomers({ search: search || undefined })
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Customers</h1>
        <Link
          to="/customers/new"
          className="rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 hover:bg-brand-dark"
        >
          + Add
        </Link>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search customers…" />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500 text-sm">No customers found.</p>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}
