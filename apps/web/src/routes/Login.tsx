import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputSchema, type LoginInput } from "@firearmour/shared";
import { useAuth } from "../hooks/useAuth.js";
import { FormField, inputClass } from "../components/FormField.js";
import { AuthLayout } from "../components/AuthLayout.js";
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
      const user = await login(data);
      const defaultPath = user.role === "CLIENT" ? "/portal" : "/";
      const from = (location.state as { from?: string } | null)?.from ?? defaultPath;
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <AuthLayout
      headline={
        <>
          Protection
          <br />
          that never
          <br />
          expires.
        </>
      }
      tagline="Fire Armour tracks every extinguisher and every renewal, so nothing slips past its date."
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Sign in to Fire Armour</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back — enter your details to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    </AuthLayout>
  );
}
