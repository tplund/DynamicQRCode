"use client";

import { useState } from "react";

interface FAQProps {
  messages: {
    title: string;
    q1: string; a1: string;
    q2: string; a2: string;
    q3: string; a3: string;
    q4: string; a4: string;
    q5: string; a5: string;
    q6: string; a6: string;
  };
}

export default function FAQ({ messages }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  const items = [
    { q: messages.q1, a: messages.a1 },
    { q: messages.q2, a: messages.a2 },
    { q: messages.q3, a: messages.a3 },
    { q: messages.q4, a: messages.a4 },
    { q: messages.q5, a: messages.a5 },
    { q: messages.q6, a: messages.a6 },
  ];

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {messages.title}
        </h2>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl bg-white ring-1 ring-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer"
              >
                <span className="text-sm font-semibold text-gray-900 pr-4">{item.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  open === i ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="px-6 text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
