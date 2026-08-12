import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  unitInputSchema,
  EXTINGUISHER_TYPES,
  EXTINGUISHER_TYPE_LABELS,
  RENEWAL_PERIODS,
  RENEWAL_PERIOD_LABELS,
  type UnitInput,
} from "@firearmour/shared";
import { createUnit, getUnit, updateUnit } from "../api/units.js";
import { FormField, inputClass } from "../components/FormField.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

function toDateInput(value?: string | Date) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function UnitForm() {
  const { customerId, id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [loading, setLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resolvedCustomerId, setResolvedCustomerId] = useState(customerId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnitInput>({
    resolver: zodResolver(unitInputSchema),
    defaultValues: {
      type: "ABC_DRY_CHEMICAL",
      size: "",
      serialNumber: "",
      installDate: new Date(),
      renewalPeriod: "ANNUAL",
      location: "",
    },
  });

  const renewalPeriod = watch("renewalPeriod");

  useEffect(() => {
    if (!id) return;
    getUnit(id)
      .then((unit) => {
        setResolvedCustomerId(unit.customerId);
        reset({
          type: unit.type,
          size: unit.size,
          serialNumber: unit.serialNumber,
          installDate: new Date(unit.installDate),
          renewalPeriod: unit.renewalPeriod,
          customIntervalDays: unit.customIntervalDays ?? undefined,
          location: unit.location ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data: UnitInput) {
    setSubmitError(null);
    try {
      if (isEdit && id) {
        await updateUnit(id, data);
        navigate(`/units/${id}`);
      } else if (resolvedCustomerId) {
        const unit = await createUnit(resolvedCustomerId, data);
        navigate(`/units/${unit.id}`);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-xl font-semibold">{isEdit ? "Edit Extinguisher" : "Add Extinguisher"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Type" error={errors.type?.message}>
          <select className={inputClass} {...register("type")}>
            {EXTINGUISHER_TYPES.map((t) => (
              <option key={t} value={t}>
                {EXTINGUISHER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Size" error={errors.size?.message}>
            <input className={inputClass} placeholder="10 lb" {...register("size")} />
          </FormField>
          <FormField label="Serial number" error={errors.serialNumber?.message}>
            <input className={inputClass} {...register("serialNumber")} />
          </FormField>
        </div>
        <FormField label="Install date" error={errors.installDate?.message}>
          <input
            className={inputClass}
            type="date"
            defaultValue={toDateInput(new Date())}
            {...register("installDate")}
          />
        </FormField>
        <FormField label="Renewal period" error={errors.renewalPeriod?.message}>
          <select className={inputClass} {...register("renewalPeriod")}>
            {RENEWAL_PERIODS.map((p) => (
              <option key={p} value={p}>
                {RENEWAL_PERIOD_LABELS[p]}
              </option>
            ))}
          </select>
        </FormField>
        {renewalPeriod === "CUSTOM" && (
          <FormField label="Custom interval (days)" error={errors.customIntervalDays?.message}>
            <input className={inputClass} type="number" min={1} {...register("customIntervalDays")} />
          </FormField>
        )}
        <FormField label="Location">
          <input className={inputClass} placeholder="Kitchen - near back exit" {...register("location")} />
        </FormField>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {!online && <p className="text-sm text-amber-700">You're offline — reconnect to save this unit.</p>}

        <button
          type="submit"
          disabled={isSubmitting || !online}
          className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand-dark disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Extinguisher"}
        </button>
      </form>
    </div>
  );
}
