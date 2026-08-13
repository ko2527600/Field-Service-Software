import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerInputSchema, type RegisterInput } from "@firearmour/shared";
import { useAuth } from "../hooks/useAuth.js";
import { FormField, inputClass } from "../components/FormField.js";
import { Logo } from "../components/Logo.js";
import { ApiError } from "../api/client.js";

export default function Register() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerInputSchema) });

  async function onSubmit(data: RegisterInput) {
    setSubmitError(null);
    try {
      await registerAccount(data);
      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-14 w-14" />
          <h1 className="text-xl font-extrabold tracking-tight">Set up Fire Armour</h1>
          <p className="text-sm text-gray-500 text-center">
            Create the first account for your business. This is a one-time setup.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-xl border border-gray-200 p-5 shadow-card">
          <FormField label="Business name" error={errors.businessName?.message}>
            <input className={inputClass} {...register("businessName")} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input className={inputClass} type="email" autoComplete="email" {...register("email")} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <input className={inputClass} type="password" autoComplete="new-password" {...register("password")} />
          </FormField>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already set up?{" "}
          <Link to="/login" className="text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
