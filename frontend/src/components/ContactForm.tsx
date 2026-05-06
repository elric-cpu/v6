"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { LeadRequest, ServiceCard } from "@/types";

interface ContactFormProps {
  services: ServiceCard[];
}

export default function ContactForm({ services }: ContactFormProps) {
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {successMessage ? (
        <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      ) : null}
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
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
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium text-benson-charcoal">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address ?? ""}
          onChange={(event) => handleChange("address", event.target.value)}
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
            className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
            className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
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
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
        >
          <option value="standard">Standard</option>
          <option value="soon">Soon</option>
          <option value="emergency">Emergency</option>
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
          placeholder="Describe what needs attention, include timing, and note whether the condition is active now."
          onChange={(event) => handleChange("message", event.target.value)}
          className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-benson-maroon px-4 py-3 font-medium text-white transition-colors hover:bg-benson-maroon-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
