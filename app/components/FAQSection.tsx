"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How long does it take to build a B2B marketplace?",
    a: "A standard B2B marketplace with product catalog, cart, payments, and admin dashboard takes 3–4 weeks. Complex platforms with AI integration, multi-warehouse, and real-time features take 6–8 weeks. We always provide a fixed timeline before starting.",
  },
  {
    q: "Do I own the source code after the project?",
    a: "Yes — 100%. You own everything. Source code, database schemas, and all assets are transferred to you at project completion. No licensing fees, no vendor lock-in.",
  },
  {
    q: "What tech stack do you use?",
    a: "Our primary stack is Next.js (App Router), Supabase (PostgreSQL + Auth + Realtime), Tailwind CSS, TypeScript, and Clerk for authentication. For payments: Stripe, PayPal, and IntaSend (M-Pesa). We adapt to your existing stack if needed.",
  },
  {
    q: "Can you work with our existing codebase?",
    a: "Absolutely. We're comfortable jumping into existing Next.js, React, or Node.js projects. We start with a thorough code review and provide a clear plan before making any changes.",
  },
  {
    q: "Do you provide post-launch support?",
    a: "Yes. Every project includes 1–3 months of post-launch support depending on the plan. We also offer monthly retainer packages for ongoing development, feature additions, and maintenance.",
  },
  {
    q: "How do we communicate during the project?",
    a: "We use Slack or WhatsApp for daily communication, weekly video calls for progress reviews, and Notion or Linear for task tracking. You'll always know exactly where your project stands.",
  },
  {
    q: "Can you integrate with M-Pesa and local African payment methods?",
    a: "Yes — this is one of our core specialties. We integrate M-Pesa via IntaSend, Daraja API, and other local payment rails. We understand the nuances of East African payment infrastructure.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We work iteratively with your feedback throughout the project, so there are no surprises at the end. We offer unlimited revisions on UI/UX within the project scope, and we don't consider a project done until you're genuinely satisfied.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We have clients across Kenya, Uganda, Tanzania, Nigeria, UAE, Singapore, and Europe. We work remotely with clients worldwide. Payments accepted in USD, KES, and major currencies.",
  },
  {
    q: "Can you add AI features to my existing platform?",
    a: "Yes. We offer AI integration as a standalone service — adding LLM-powered chat assistants, automated content generation, smart product recommendations, and predictive analytics to existing applications.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-[#08090F]">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span className="text-[#A0A3C4]">Common Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg">
            Everything you need to know before starting your project.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i
                  ? "bg-[#1A1535] border-[#6C47FF]/40"
                  : "bg-[#0D0F1E] border-white/7 hover:border-white/15"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className={`text-sm font-semibold ${open === i ? "text-white" : "text-[#A0A3C4]"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-[#6C47FF] transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === i && (
                <div className="px-6 pb-5 animate-slideDown">
                  <p className="text-sm text-[#A0A3C4] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#A0A3C4] text-sm mb-4">
            Still have questions? We're always happy to chat.
          </p>
          <a
            href="https://wa.me/254757528133?text=Hi%2C%20I%27d%20like%20to%20ask%20about%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
