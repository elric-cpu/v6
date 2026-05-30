"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { LeadRequest, ServiceCard } from "@/types";
import TurnstileWidget from "@/components/TurnstileWidget";

interface ContactFormProps {
  services: ServiceCard[];
}

export default function ContactForm({ services }: ContactFormProps) {
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const [formData, setFormData] = useState<LeadRequest>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    serviceType: services[0]?.serviceType ?? "inspection-repairs",
    message: "",
    urgency: "standard",
    sourcePage: "/contact",
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange<K extends keyof LeadRequest>(field: K, value: LeadRequest[K]) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.submitLeadRequest({
        ...formData,
        email: formData.email || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        turnstileToken: turnstileToken || undefined,
      });

      setSuccessMessage(response.message);
      setFormData((current) => ({
        ...current,
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        zipCode: "",
        message: "",
        urgency: "standard",
      }));
      setTurnstileToken(null);
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setError(submitError.message);
      } else {
        setError("Failed to send your request. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !turnstileEnabled || Boolean(turnstileToken);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {successMessage ? (
        <div className="rounded-lg border border-benson-burgundy bg-benson-cream px-4 py-3 text-sm text-benson-charcoal">
          {successMessage}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-benson-maroon bg-benson-offwhite px-4 py-3 text-sm font-medium text-benson-wine">
          {error}
        </div>
      ) : null}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(event) => handleChange("name", event.target.value)}
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email ?? ""}
          onChange={(event) => handleChange("email", event.target.value)}
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        />
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Address or location
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address ?? ""}
          onChange={(event) => handleChange("address", event.target.value)}
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-benson-charcoal">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city ?? ""}
            onChange={(event) => handleChange("city", event.target.value)}
            className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
          />
        </div>
        <div>
          <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-benson-charcoal">
            ZIP Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode ?? ""}
            onChange={(event) => handleChange("zipCode", event.target.value)}
            className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
          />
        </div>
      </div>
      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Service Type *
        </label>
        <select
          id="service"
          name="service"
          required
          value={formData.serviceType}
          onChange={(event) =>
            handleChange("serviceType", event.target.value as LeadRequest["serviceType"])
          }
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        >
          {services.map((service) => (
            <option key={service.id} value={service.serviceType}>
              {service.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="urgency" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Urgency
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={(event) =>
            handleChange("urgency", event.target.value as LeadRequest["urgency"])
          }
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        >
          <option value="standard">Standard</option>
          <option value="soon">Soon</option>
          <option value="emergency">Priority condition</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          placeholder="Describe what needs attention. Include photos/dimensions if available, address or location, access notes, priority level, and timing constraints."
          onChange={(event) => handleChange("message", event.target.value)}
          className="w-full rounded-lg border border-benson-pale px-4 py-2 transition-colors duration-200 ease-out focus:border-benson-maroon focus:outline-none focus:ring-2 focus:ring-benson-maroon/20"
        />
      </div>
      <div className="rounded-xl border border-benson-pale bg-benson-cream p-4">
        <TurnstileWidget onTokenChange={setTurnstileToken} />
        {turnstileEnabled ? (
          <p className="mt-2 text-xs text-benson-slate">
            Complete the security check before submitting. This helps reduce spam
            and protects the contact inbox.
          </p>
        ) : null}
      </div>
      {!canSubmit ? (
        <p className="text-sm text-benson-wine">
          Please complete the security check before sending your request.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting || !canSubmit}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-benson-maroon px-4 py-3 font-medium text-benson-offwhite shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-maroon-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-benson-maroon disabled:hover:shadow-sm disabled:active:translate-y-0"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
