"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-benson-pale bg-benson-offwhite">
          <button
            className="flex w-full items-center justify-between bg-benson-offwhite p-4 text-left transition-colors duration-200 ease-out hover:bg-benson-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-benson-maroon active:bg-benson-cream"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="min-w-0 break-words pr-3 font-medium text-benson-charcoal">
              {item.question}
            </span>
            <svg
              className={`h-5 w-5 shrink-0 text-benson-maroon transition-transform duration-200 ease-out ${openIndex === index ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4 pt-0 text-benson-slate">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
