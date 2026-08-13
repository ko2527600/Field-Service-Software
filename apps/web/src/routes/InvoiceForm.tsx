import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema, EXTINGUISHER_TYPE_LABELS, type CreateInvoiceInput } from "@firearmour/shared";
import { getCustomer } from "../api/customers.js";
import { createInvoice } from "../api/invoices.js";
import type { CustomerWithUnits } from "../api/types.js";
import { FormField, inputClass } from "../components/FormField.js";
import { PlusIcon, InvoiceIcon } from "../components/icons/index.js";

export default function InvoiceForm() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerWithUnits | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerId,
      lineItems: [{ description: "", quantity: 1, unitPrice: 0, unitId: "", serviceType: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });
  const lineItems = watch("lineItems");

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId)
      .then(setCustomer)
      .finally(() => setLoading(false));
  }, [customerId]);

  function handleUnitSelect(index: number, unitId: string) {
    setValue(`lineItems.${index}.unitId`, unitId);
    const unit = customer?.units.find((u) => u.id === unitId);
    if (unit && !lineItems[index]?.description) {
      setValue(`lineItems.${index}.description`, `${EXTINGUISHER_TYPE_LABELS[unit.type]} · ${unit.size} service`);
    }
  }

  async function onSubmit(data: CreateInvoiceInput) {
    setSubmitError(null);
    try {
      const cleaned = {
        ...data,
        lineItems: data.lineItems.map((item) => ({ ...item, unitId: item.unitId || undefined })),
      };
      const invoice = await createInvoice(cleaned);
      navigate(`/invoices/${invoice.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const total = lineItems?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) ?? 0;

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-2">
        <InvoiceIcon className="h-6 w-6 text-brand" strokeWidth={1.6} />
        <h1 className="text-xl font-extrabold tracking-tight">New Invoice</h1>
      </div>
      {customer && <p className="text-sm text-gray-500">{customer.name}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Due date" error={errors.dueDate?.message}>
          <input className={inputClass} type="date" {...register("dueDate")} />
        </FormField>

        <div className="space-y-3">
          <span className="block text-sm font-medium text-gray-700">Line items</span>
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 bg-white p-3 space-y-2 shadow-card">
              {customer && customer.units.length > 0 && (
                <select
                  className={inputClass}
                  value={lineItems?.[index]?.unitId ?? ""}
                  onChange={(e) => handleUnitSelect(index, e.target.value)}
                >
                  <option value="">No specific unit</option>
                  {customer.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {EXTINGUISHER_TYPE_LABELS[u.type]} · {u.size} (SN {u.serialNumber})
                    </option>
                  ))}
                </select>
              )}
              <FormField label="Description" error={errors.lineItems?.[index]?.description?.message}>
                <input className={inputClass} {...register(`lineItems.${index}.description`)} />
              </FormField>
              <div className="grid grid-cols-3 gap-2">
                <FormField label="Service type">
                  <input className={inputClass} {...register(`lineItems.${index}.serviceType`)} />
                </FormField>
                <FormField label="Qty" error={errors.lineItems?.[index]?.quantity?.message}>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    {...register(`lineItems.${index}.quantity`)}
                  />
                </FormField>
                <FormField label="Price" error={errors.lineItems?.[index]?.unitPrice?.message}>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min={0}
                    {...register(`lineItems.${index}.unitPrice`)}
                  />
                </FormField>
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove line item
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ description: "", quantity: 1, unitPrice: 0, unitId: "", serviceType: "" })}
            className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
          >
            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
            Add line item
          </button>
        </div>

        {errors.lineItems?.message && <p className="text-sm text-red-600">{errors.lineItems.message}</p>}

        <div className="flex justify-between items-center rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-extrabold">${total.toFixed(2)}</span>
        </div>

        <FormField label="Notes">
          <textarea className={inputClass} rows={2} {...register("notes")} />
        </FormField>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create Invoice"}
        </button>
      </form>
    </div>
  );
}
