import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCustomers } from "../api/customers.js";
import type { CustomerWithUnits } from "../api/types.js";
import { CustomerListItem } from "../components/CustomerListItem.js";
import { SearchInput } from "../components/SearchInput.js";
import { FooterBand } from "../components/FooterBand.js";
import { PlusIcon, CustomersIcon } from "../components/icons/index.js";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold tracking-tight">Customers</h1>
        <Link
          to="/customers/new"
          className="inline-flex items-center gap-1 rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 shadow-card hover:bg-brand-dark"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
          Add
        </Link>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search customers…" />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-center py-10 text-gray-400">
          <CustomersIcon className="h-10 w-10" strokeWidth={1.5} />
          <p className="text-sm">No customers yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      <FooterBand />
    </div>
  );
}
