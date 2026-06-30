"use client";

import { Check, Zap, Building2, Crown, ArrowRight } from "lucide-react";

type PricingSectionProps = {
  onCTAClick: () => void;
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    color: "#6C47FF",
    price: "$2,500",
    period: "project",
    description:
      "Perfect for MVPs, landing pages, and small business applications.",
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
    description:
      "Complete B2B platforms, SaaS apps, and production-ready enterprise systems.",
    features: [
      "Unlimited features & modules",
      "Full B2B marketplace setup",
      "Advanced auth & RBAC",
      "AI/LLM integration",
      "All payment gateways",
      "Real-time features",
      "Admin dashboard",
      "4 weeks delivery",
      "3 months post-launch support",
      "SEO optimization",
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
    description:
      "Long-term partnerships, large-scale platforms, and dedicated development teams.",
    features: [
      "Everything in Professional",
      "Dedicated development team",
      "Custom API integrations",
      "Microservices architecture",
      "DevOps & CI/CD setup",
      "Cloud deployment",
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


export default function PricingSection({
  onCTAClick,
}: PricingSectionProps) {

  return (
    <section
      id="pricing"
      className="relative py-24 bg-[#05060F]"
    >

      <div className="absolute inset-0 bg-grid opacity-40" />


      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">


        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
            <span className="text-[#A0A3C4]">
              Transparent Pricing
            </span>
          </div>


          <h2 className="text-4xl font-black text-white">
            Investment in Your{" "}
            <span className="gradient-text">
              Digital Future
            </span>
          </h2>

        </div>



        <div className="grid md:grid-cols-3 gap-6 mb-16">

          {plans.map((plan)=>{

            const Icon = plan.icon;

            return (

              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col ${
                  plan.popular
                    ? "bg-[#1A1535] border-2 border-[#6C47FF]"
                    : "bg-[#0D0F1E] border border-white/10"
                }`}
              >


                <Icon
                  className="w-6 h-6 mb-5"
                  style={{color:plan.color}}
                />


                <h3 className="text-xl font-bold text-white">
                  {plan.name}
                </h3>


                <p className="text-sm text-[#A0A3C4] my-4">
                  {plan.description}
                </p>


                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">
                    / {plan.period}
                  </span>
                </div>



                <ul className="space-y-3 flex-1 mb-8">

                  {plan.features.map((feature)=>(

                    <li
                      key={feature}
                      className="flex gap-2 text-sm text-[#A0A3C4]"
                    >

                      <Check
                        size={16}
                        style={{color:plan.color}}
                      />

                      {feature}

                    </li>

                  ))}

                </ul>



                <button
                  onClick={onCTAClick}
                  className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 ${
                    plan.popular
                    ? "btn-brand"
                    : "btn-outline"
                  }`}
                >

                  {plan.cta}

                  <ArrowRight size={16}/>

                </button>


              </div>

            );

          })}

        </div>



        <div className="max-w-3xl mx-auto">

          <h3 className="text-center text-xl text-white font-bold mb-6">
            Optional Add-ons
          </h3>


          <div className="grid sm:grid-cols-2 gap-3">

            {addons.map((addon)=>(

              <div
                key={addon.label}
                className="glass rounded-xl px-4 py-3 flex justify-between"
              >

                <span className="text-sm text-[#A0A3C4]">
                  {addon.label}
                </span>

                <span className="font-bold text-[#6C47FF]">
                  {addon.price}
                </span>

              </div>

            ))}

          </div>


        </div>


      </div>

    </section>
  );
}