import { useState } from "react";
import { createPortalAccess } from "../api/customers.js";
import type { PortalAccess, PortalAccessCreated } from "../api/customers.js";
import { ShieldIcon } from "./icons/index.js";

export function PortalAccessPanel({
  customerId,
  access,
  onCreated,
}: {
  customerId: string;
  access: PortalAccess;
  onCreated: (access: PortalAccess) => void;
}) {
  const [email, setEmail] = useState(access.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<PortalAccessCreated | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await createPortalAccess(customerId, email);
      setCreated(result);
      onCreated({ email: result.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card space-y-3">
      <div className="flex items-center gap-2">
        <ShieldIcon className="h-4 w-4 text-brand" strokeWidth={1.8} />
        <h2 className="text-sm font-semibold text-gray-700">Client Portal Access</h2>
      </div>
      <p className="text-sm text-gray-500">
        Give this client a read-only login to view their extinguisher compliance status and download
        invoices.
      </p>

      {access.email && !created && (
        <p className="text-sm text-gray-700">
          Portal login active for <span className="font-medium">{access.email}</span>.
        </p>
      )}

      {created ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm space-y-1">
          <p className="text-amber-900 font-medium">Share these credentials with the client now.</p>
          <p className="text-amber-800">This password won't be shown again.</p>
          <p className="text-amber-900">
            Email: <span className="font-mono">{created.email}</span>
          </p>
          <p className="text-amber-900">
            Temporary password: <span className="font-mono">{created.temporaryPassword}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="client@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
          >
            {access.email ? "Reset Access" : "Create Access"}
          </button>
        </form>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
