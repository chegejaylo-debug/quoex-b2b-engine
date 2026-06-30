"use client";

import { Check, Zap, Building2, Crown, ArrowRight } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    color: "#6C47FF",
    price: "$2,500",
    period: "project",
    description: "Perfect for MVPs, landing pages, and small business applications.",
    features: [
      "Up to 10 core features",
      "Next.js + Supabase stack",
      "Basic auth (Clerk/Supabase)",
      "Responsive mobile design",
      "3 payment gateway integrations",
      "2 weeks delivery",
      "1 month post-launch support",
      "Source code ownership",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    icon: Building2,
    color: "#FF6B35",
    price: "$8,500",
    period: "project",
    description: "Complete B2B platforms, SaaS apps, and production-ready enterprise systems.",
    features: [
      "Unlimited features & modules",
      "Full B2B marketplace setup",
      "Advanced auth & RBAC",
      "AI/LLM integration",
      "All payment gateways",
      "Real-time features (Supabase)",
      "Admin dashboard",
      "4 weeks delivery",
      "3 months post-launch support",
      "SEO & performance optimization",
    ],
    cta: "Most Popular — Start Now",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    color: "#00D4AA",
    price: "Custom",
    period: "engagement",
    description: "Long-term partnerships, large-scale platforms, and dedicated development teams.",
    features: [
      "Everything in Professional",
      "Dedicated development team",
      "Custom API integrations",
      "Microservices architecture",
      "DevOps & CI/CD setup",
      "On-premise or cloud deployment",
      "SLA-backed support",
      "Monthly retainer available",
      "Weekly progress calls",
      "12-month support contract",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const addons = [
  { label: "Social Media API Integration", price: "+$500" },
  { label: "Order Tracking with Live Map", price: "+$800" },
  { label: "AI Chat Assistant", price: "+$1,200" },
  { label: "Bulk Import / Export System", price: "+$400" },
  { label: "Multi-language (i18n)", price: "+$600" },
  { label: "Mobile App (React Native)", price: "+$4,000" },
];

export default function PricingSection({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <section id="pricing" className="relative py-24 bg-[#05060F]">
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
            <span className="text-[#A0A3C4]">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Investment in Your{" "}
            <span className="gradient-text">Digital Future</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg leading-relaxed">
            No hidden fees. Fixed-price projects. Source code ownership. Lifetime support options available.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-[#1A1535] to-[#0D0F1E] border-2 border-[#6C47FF]/50 shadow-2xl shadow-[#6C47FF]/20 scale-105"
                    : "bg-[#0D0F1E] border border-white/7 hover:border-white/15 card-glow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6C47FF] to-[#FF6B35] text-white text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-[#A0A3C4] mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-[#6B6F8E] ml-1">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#A0A3C4]">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCTAClick}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "btn-brand"
                      : "btn-outline"
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-center text-xl font-bold text-white mb-6">Optional Add-ons</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {addons.map((addon) => (
              <div
                key={addon.label}
                className="flex items-center justify-between glass rounded-xl px-4 py-3"
              >
                <span className="text-sm text-[#A0A3C4]">{addon.label}</span>
                <span className="text-sm font-bold text-[#6C47FF]">{addon.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#6B6F8E] mt-6">
            All prices in USD. Kenyan clients can pay in KES at current exchange rate.
            M-Pesa, Stripe, and bank transfer accepted.
          </p>
        </div>
      </div>
    </section>
  );
}
