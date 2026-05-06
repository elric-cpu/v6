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
        <div key={index} className="border border-benson-pale rounded-lg">
          <button
            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-benson-cream transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-benson-charcoal">
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 text-benson-maroon transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
