import { useEffect, useState } from "react";
import { listStaff, inviteStaff, revokeStaff } from "../api/business.js";
import type { StaffMember, StaffInvited } from "../api/business.js";
import { UserIcon } from "./icons/index.js";

export function StaffAccessPanel() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invited, setInvited] = useState<StaffInvited | null>(null);

  function reload() {
    setLoading(true);
    listStaff()
      .then(setStaff)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await inviteStaff(email);
      setInvited(result);
      setEmail("");
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this technician's access? They'll be logged out immediately.")) return;
    await revokeStaff(id);
    reload();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-card space-y-3">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-brand" strokeWidth={1.8} />
        <h2 className="text-sm font-semibold text-gray-700">Field Technician Access</h2>
      </div>
      <p className="text-sm text-gray-500">
        Technicians can view customers and units, scan QR codes, and log service visits -- but can't touch
        invoicing, payment/SMS settings, or delete records.
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : staff.length > 0 ? (
        <ul className="space-y-1">
          {staff.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-2 text-sm py-1">
              <span>{member.email}</span>
              <button
                type="button"
                onClick={() => handleRevoke(member.id)}
                className="text-red-600 hover:underline text-xs font-medium"
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No technician logins yet.</p>
      )}

      {invited && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm space-y-1">
          <p className="text-amber-900 font-medium">Share these credentials with the technician now.</p>
          <p className="text-amber-800">This password won't be shown again.</p>
          <p className="text-amber-900">
            Email: <span className="font-mono">{invited.email}</span>
          </p>
          <p className="text-amber-900">
            Temporary password: <span className="font-mono">{invited.temporaryPassword}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="technician@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
        >
          Invite Technician
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
