import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceLogInputSchema, computeNextRenewalDate, type ServiceLogInput } from "@firearmour/shared";
import { getUnit } from "../api/units.js";
import { createServiceLog } from "../api/serviceLogs.js";
import type { UnitWithLogs } from "../api/types.js";
import { FormField, inputClass } from "../components/FormField.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

function toDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default function ServiceLogForm() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [unit, setUnit] = useState<UnitWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ServiceLogInput>({
    resolver: zodResolver(serviceLogInputSchema),
    defaultValues: {
      serviceDate: new Date(),
      technician: "",
      notes: "",
      nextDueDate: new Date(),
    },
  });

  const serviceDate = watch("serviceDate");

  useEffect(() => {
    if (!unitId) return;
    getUnit(unitId)
      .then((u) => {
        setUnit(u);
        const suggested = computeNextRenewalDate(new Date(), u.renewalPeriod, u.customIntervalDays);
        setValue("nextDueDate", toDateInput(suggested) as unknown as Date);
      })
      .finally(() => setLoading(false));
  }, [unitId, setValue]);

  useEffect(() => {
    if (!unit || dirtyFields.nextDueDate) return;
    const suggested = computeNextRenewalDate(serviceDate, unit.renewalPeriod, unit.customIntervalDays);
    setValue("nextDueDate", toDateInput(suggested) as unknown as Date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceDate, unit]);

  async function onSubmit(data: ServiceLogInput) {
    if (!unitId) return;
    setSubmitError(null);
    try {
      await createServiceLog(unitId, data);
      navigate(`/units/${unitId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-xl font-semibold">Log Service Visit</h1>
      {unit && (
        <p className="text-sm text-gray-500">
          {unit.customerName} — SN {unit.serialNumber}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Service date" error={errors.serviceDate?.message}>
          <input
            className={inputClass}
            type="date"
            defaultValue={toDateInput(new Date())}
            {...register("serviceDate")}
          />
        </FormField>
        <FormField label="Technician">
          <input className={inputClass} {...register("technician")} />
        </FormField>
        <FormField label="Amount charged" error={errors.amountCharged?.message}>
          <input className={inputClass} type="number" step="0.01" min={0} {...register("amountCharged")} />
        </FormField>
        <FormField label="Next due date" error={errors.nextDueDate?.message}>
          <input className={inputClass} type="date" {...register("nextDueDate")} />
        </FormField>
        <p className="text-xs text-gray-400 -mt-2">
          Suggested from this unit's renewal period — adjust if needed.
        </p>
        <FormField label="Notes">
          <textarea className={inputClass} rows={3} {...register("notes")} />
        </FormField>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {!online && <p className="text-sm text-amber-700">You're offline — reconnect to save this visit.</p>}

        <button
          type="submit"
          disabled={isSubmitting || !online}
          className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand-dark disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Visit"}
        </button>
      </form>
    </div>
  );
}
