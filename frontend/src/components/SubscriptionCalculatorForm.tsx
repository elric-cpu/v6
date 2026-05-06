"use client";

import { FormEvent, useMemo, useState } from "react";
import { api, ApiError, type SubscriptionRecommendationResult } from "@/lib/api";

interface FormState {
  propertyType: "residential" | "commercial" | "churches-nonprofits";
  squareFootage: string;
  propertyAge: string;
  homeValue: string;
  region: "sweet-home-25-mile" | "harney-county";
}

const propertyTypeOptions = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "churches-nonprofits", label: "Churches / Non-Profits" },
] as const;

const regionOptions = [
  { value: "sweet-home-25-mile", label: "Sweet Home 25-Mile Silo" },
  { value: "harney-county", label: "Harney County" },
] as const;

export default function SubscriptionCalculatorForm() {
  const [formState, setFormState] = useState<FormState>({
    propertyType: "residential",
    squareFootage: "",
    propertyAge: "",
    homeValue: "",
    region: "sweet-home-25-mile",
  });
  const [result, setResult] = useState<SubscriptionRecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      formState.squareFootage.trim().length > 0
      && formState.propertyAge.trim().length > 0,
    [formState.propertyAge, formState.squareFootage],
  );

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const recommendation = await api.getSubscriptionRecommendation({
        propertyType: formState.propertyType,
        squareFootage: Number(formState.squareFootage),
        propertyAge: Number(formState.propertyAge),
        region: formState.region,
        ...(formState.homeValue.trim()
          ? { homeValue: Number(formState.homeValue) }
          : {}),
      });

      setResult(recommendation);
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setError(submitError.message);
      } else {
        setError("The recommendation tool is unavailable right now. Please try again later.");
      }
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form
        className="rounded-3xl border border-benson-pale bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-benson-charcoal">
              Property Type
            </label>
            <select
              value={formState.propertyType}
              onChange={(event) =>
                updateField("propertyType", event.target.value as FormState["propertyType"])
              }
              className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
            >
              {propertyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-benson-charcoal">
              Square Footage *
            </label>
            <input
              type="number"
              min="1"
              value={formState.squareFootage}
              onChange={(event) => updateField("squareFootage", event.target.value)}
              className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-benson-charcoal">
              Property Age *
            </label>
            <input
              type="number"
              min="1"
              value={formState.propertyAge}
              onChange={(event) => updateField("propertyAge", event.target.value)}
              className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-benson-charcoal">
              Estimated Property Value
            </label>
            <input
              type="number"
              min="1"
              value={formState.homeValue}
              onChange={(event) => updateField("homeValue", event.target.value)}
              className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-benson-charcoal">
              Region
            </label>
            <select
              value={formState.region}
              onChange={(event) =>
                updateField("region", event.target.value as FormState["region"])
              }
              className="w-full rounded border border-benson-pale px-4 py-2 focus:border-benson-maroon focus:outline-none"
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="mt-6 w-full rounded bg-benson-maroon px-4 py-3 font-medium text-white transition-colors hover:bg-benson-maroon-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Calculating..." : "Get Recommendation"}
        </button>
      </form>

      <aside className="rounded-3xl border border-benson-pale bg-benson-cream p-6">
        <h2 className="text-2xl font-semibold text-benson-charcoal">
          Educational Estimate
        </h2>
        <p className="mt-3 text-sm text-benson-slate">
          This tool is for planning only. It does not guarantee savings, scope,
          response timing, or final plan fit.
        </p>

        {result ? (
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-benson-maroon">
                Recommended Plan
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-benson-charcoal">
                {result.recommendedPlan.name}
              </h3>
              <p className="mt-1 text-sm text-benson-slate">
                {result.recommendedPlan.description}
              </p>
            </div>
            <div className="rounded-2xl border border-benson-pale bg-white p-4">
              <p className="text-sm text-benson-slate">Monthly plan cost</p>
              <p className="text-3xl font-semibold text-benson-charcoal">
                ${result.recommendedPlan.priceMonthly}
              </p>
            </div>
            {typeof result.annualSavings === "number" ? (
              <div className="rounded-2xl border border-benson-pale bg-white p-4">
                <p className="text-sm text-benson-slate">Estimated annual savings</p>
                <p className="text-3xl font-semibold text-benson-charcoal">
                  ${result.annualSavings.toLocaleString()}
                </p>
              </div>
            ) : null}
            <div>
              <h4 className="font-semibold text-benson-charcoal">Assumptions returned</h4>
              <ul className="mt-3 space-y-2 text-sm text-benson-slate">
                <li>Age-based rate: {(result.assumptions.ageBasedRate * 100).toFixed(0)}%</li>
                <li>
                  Annual subscription cost: $
                  {result.assumptions.annualSubscriptionCost.toLocaleString()}
                </li>
                <li>
                  Annual maintenance estimate: $
                  {result.assumptions.annualMaintenanceCost.toLocaleString()}
                </li>
              </ul>
            </div>
            <p className="text-sm text-benson-slate">{result.disclaimer}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-benson-pale bg-white p-6 text-sm text-benson-slate">
            Enter the property details to see the recommended plan and the assumptions the API returns.
          </div>
        )}
      </aside>
    </div>
  );
}
