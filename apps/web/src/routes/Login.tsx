import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputSchema, type LoginInput } from "@firearmour/shared";
import { useAuth } from "../hooks/useAuth.js";
import { FormField, inputClass } from "../components/FormField.js";
import { Logo } from "../components/Logo.js";
import { ApiError } from "../api/client.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginInputSchema) });

  async function onSubmit(data: LoginInput) {
    setSubmitError(null);
    try {
      await login(data);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-14 w-14" />
          <h1 className="text-xl font-extrabold tracking-tight">Sign in to Fire Armour</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-xl border border-gray-200 p-5 shadow-card">
          <FormField label="Email" error={errors.email?.message}>
            <input className={inputClass} type="email" autoComplete="email" {...register("email")} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <input className={inputClass} type="password" autoComplete="current-password" {...register("password")} />
          </FormField>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand text-white text-sm font-medium px-4 py-2 shadow-card hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          First time?{" "}
          <Link to="/register" className="text-brand hover:underline">
            Set up your business
          </Link>
        </p>
      </div>
    </div>
  );
}
