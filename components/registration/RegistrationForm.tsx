"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { registrationSchema } from "@/lib/validation";

type FieldErrors = Partial<Record<keyof FormValues, string[]>>;

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
};

export function RegistrationForm({
  defaultValues,
}: {
  defaultValues: { fullName: string; email: string };
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    fullName: defaultValues.fullName,
    email: defaultValues.email,
    phone: "",
    organization: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(key: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = registrationSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors as FieldErrors);
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));

      const canProceed =
        res.status === 201 ||
        (res.status === 409 && data.code === "ALREADY_REGISTERED");

      if (canProceed) {
        const checkout = await fetch("/api/checkout", { method: "POST" });
        const cdata = await checkout.json().catch(() => ({}));
        if (checkout.ok && cdata.url) {
          window.location.href = cdata.url;
          return;
        }
        if (cdata.code === "ALREADY_PAID") {
          router.push("/dashboard");
          return;
        }
        setFormError(cdata.error ?? "Could not start checkout.");
        setPending(false);
        return;
      }

      if (res.status === 422 && data.fields) {
        setFieldErrors(data.fields as FieldErrors);
        setFormError(data.error ?? "Please correct the highlighted fields.");
        setPending(false);
        return;
      }

      setFormError(data.error ?? "Something went wrong. Please try again.");
      setPending(false);
    } catch {
      setFormError("Network error. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field
        label="Full name"
        name="fullName"
        value={values.fullName}
        errors={fieldErrors.fullName}
        onChange={(v) => update("fullName", v)}
        autoComplete="name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={values.email}
        errors={fieldErrors.email}
        onChange={(v) => update("email", v)}
        autoComplete="email"
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        value={values.phone}
        errors={fieldErrors.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
      />
      <Field
        label="Organization or institution"
        name="organization"
        value={values.organization}
        errors={fieldErrors.organization}
        onChange={(v) => update("organization", v)}
        autoComplete="organization"
      />

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="border border-black px-5 py-2.5 text-sm disabled:opacity-50"
      >
        {pending ? "Redirecting to checkout…" : "Continue to payment"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  errors,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  errors?: string[];
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const errorId = `${name}-error`;
  const invalid = Boolean(errors?.length);
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        className="w-full border border-black/30 px-3 py-2 text-sm"
      />
      {invalid && (
        <p id={errorId} className="text-xs text-red-700">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}
