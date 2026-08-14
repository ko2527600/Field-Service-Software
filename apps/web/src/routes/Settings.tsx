import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessProfileInputSchema, SMS_GATEWAYS, SMS_GATEWAY_LABELS, type BusinessProfileInput } from "@firearmour/shared";
import { getBusinessProfile, updateBusinessProfile } from "../api/business.js";
import { runReminders, type ReminderRunResult } from "../api/reminders.js";
import { FormField, inputClass } from "../components/FormField.js";
import { SettingsIcon } from "../components/icons/index.js";
import { ApiError } from "../api/client.js";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [reminderRunning, setReminderRunning] = useState(false);
  const [reminderResult, setReminderResult] = useState<ReminderRunResult | null>(null);
  const [reminderError, setReminderError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BusinessProfileInput>({ resolver: zodResolver(businessProfileInputSchema) });

  const smsRemindersEnabled = watch("smsRemindersEnabled");

  useEffect(() => {
    getBusinessProfile()
      .then((b) =>
        reset({
          name: b.name,
          addressLine1: b.addressLine1 ?? "",
          addressLine2: b.addressLine2 ?? "",
          city: b.city ?? "",
          state: b.state ?? "",
          postalCode: b.postalCode ?? "",
          phone: b.phone ?? "",
          email: b.email ?? "",
          email2: b.email2 ?? "",
          smsRemindersEnabled: b.smsRemindersEnabled,
          smsReminderDaysBefore: b.smsReminderDaysBefore,
          smsGateway: b.smsGateway,
        }),
      )
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: BusinessProfileInput) {
    setSubmitError(null);
    setSaved(false);
    try {
      await updateBusinessProfile(data);
      setSaved(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function onRunRemindersNow() {
    setReminderRunning(true);
    setReminderError(null);
    setReminderResult(null);
    try {
      setReminderResult(await runReminders());
    } catch (err) {
      setReminderError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setReminderRunning(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-brand" strokeWidth={1.8} />
        <h1 className="text-xl font-extrabold tracking-tight">Business Settings</h1>
      </div>
      <p className="text-sm text-gray-500">
        This information appears on invoices sent to your customers.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Business name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone" error={errors.phone?.message}>
            <input className={inputClass} {...register("phone")} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input className={inputClass} type="email" {...register("email")} />
          </FormField>
        </div>
        <FormField label="Second email (optional)" error={errors.email2?.message}>
          <input className={inputClass} type="email" {...register("email2")} />
        </FormField>
        <FormField label="Address" error={errors.addressLine1?.message}>
          <input className={inputClass} {...register("addressLine1")} />
        </FormField>
        <FormField label="Address line 2">
          <input className={inputClass} {...register("addressLine2")} />
        </FormField>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="City">
            <input className={inputClass} {...register("city")} />
          </FormField>
          <FormField label="State">
            <input className={inputClass} {...register("state")} />
          </FormField>
          <FormField label="Postal code">
            <input className={inputClass} {...register("postalCode")} />
          </FormField>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div>
            <h2 className="font-bold text-sm">SMS Renewal Reminders</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Automatically text customers when their extinguisher is coming due. Requires an SMS gateway
              phone connected on the backend.
            </p>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand" {...register("smsRemindersEnabled")} />
            <span className="text-sm font-medium text-gray-700">Send SMS reminders</span>
          </label>
          {smsRemindersEnabled && (
            <>
              <FormField label="Days before renewal to send" error={errors.smsReminderDaysBefore?.message}>
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={90}
                  {...register("smsReminderDaysBefore")}
                />
              </FormField>
              <FormField label="SMS gateway" error={errors.smsGateway?.message}>
                <select className={inputClass} {...register("smsGateway")}>
                  {SMS_GATEWAYS.map((gateway) => (
                    <option key={gateway} value={gateway}>
                      {SMS_GATEWAY_LABELS[gateway]}
                    </option>
                  ))}
                </select>
              </FormField>
            </>
          )}
        </div>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {saved && <p className="text-sm text-success">Saved.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {smsRemindersEnabled && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card space-y-2">
          <p className="text-sm font-medium">Test reminders</p>
          <p className="text-xs text-gray-500">
            Runs the reminder check immediately instead of waiting for the next automatic run.
          </p>
          <button
            type="button"
            onClick={onRunRemindersNow}
            disabled={reminderRunning}
            className="rounded-lg border border-gray-300 text-sm font-medium px-4 py-2 hover:border-brand-100 disabled:opacity-50"
          >
            {reminderRunning ? "Running…" : "Send reminders now"}
          </button>
          {reminderError && <p className="text-sm text-red-600">{reminderError}</p>}
          {reminderResult && (
            <p className="text-sm text-gray-600">
              Checked {reminderResult.checked}, sent {reminderResult.sent}, failed {reminderResult.failed}.
              {reminderResult.errors.length > 0 && (
                <span className="block text-red-600 mt-1">{reminderResult.errors.join("; ")}</span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
