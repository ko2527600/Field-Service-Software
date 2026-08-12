import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerInputSchema, type CustomerInput } from "@firearmour/shared";
import { createCustomer, getCustomer, updateCustomer } from "../api/customers.js";
import { FormField, inputClass } from "../components/FormField.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [loading, setLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerInputSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!id) return;
    getCustomer(id)
      .then((c) =>
        reset({
          name: c.name,
          contactPhone: c.contactPhone ?? "",
          contactEmail: c.contactEmail ?? "",
          addressLine1: c.addressLine1 ?? "",
          addressLine2: c.addressLine2 ?? "",
          city: c.city ?? "",
          state: c.state ?? "",
          postalCode: c.postalCode ?? "",
          businessType: c.businessType ?? "",
          notes: c.notes ?? "",
        }),
      )
      .finally(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data: CustomerInput) {
    setSubmitError(null);
    try {
      if (isEdit && id) {
        await updateCustomer(id, data);
        navigate(`/customers/${id}`);
      } else {
        const created = await createCustomer(data);
        navigate(`/customers/${created.id}`);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-xl font-semibold">{isEdit ? "Edit Customer" : "Add Customer"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone" error={errors.contactPhone?.message}>
            <input className={inputClass} {...register("contactPhone")} />
          </FormField>
          <FormField label="Email" error={errors.contactEmail?.message}>
            <input className={inputClass} type="email" {...register("contactEmail")} />
          </FormField>
        </div>
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
        <FormField label="Business type">
          <input className={inputClass} placeholder="Restaurant, Warehouse, Office…" {...register("businessType")} />
        </FormField>
        <FormField label="Notes">
          <textarea className={inputClass} rows={3} {...register("notes")} />
        </FormField>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {!online && (
          <p className="text-sm text-amber-700">You're offline — reconnect to save this customer.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !online}
          className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand-dark disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Customer"}
        </button>
      </form>
    </div>
  );
}
