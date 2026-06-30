"use client";

import { useState } from "react";
import { Play, Code2, ArrowRight } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  color: string;
  gradient: string;
  tech: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  demoUrl?: string;
  emoji: string;
};

const projects: Project[] = [
  {
    id: "tonys-global",
    title: "Tony's Global B2B Platform",
    subtitle: "Multi-vendor wholesale marketplace",
    description:
      "A full-featured Alibaba-style B2B procurement platform for the East African market. Features real-time inventory, tiered wholesale pricing, RFQ bidding, order tracking, and multi-gateway payments.",
    category: "B2B Marketplace",
    color: "#6C47FF",
    gradient: "from-[#6C47FF] to-[#8B6FFF]",
    emoji: "🏭",
    tech: [
      "Next.js 15",
      "Supabase",
      "Tailwind CSS",
      "Stripe",
      "M-Pesa",
      "Leaflet",
    ],
    features: [
      "Tiered wholesale pricing (up to 18% bulk discount)",
      "Live seller rankings updated every 30s",
      "RFQ bidding system with supplier competition",
      "Order tracking with interactive map",
      "Multi-currency (KES / USD)",
      "WhatsApp order dispatch integration",
    ],
    metrics: [
      { label: "Products Managed", value: "500+" },
      { label: "Order Volume", value: "KES 2M+" },
      { label: "Logistics Zones", value: "12" },
    ],
    demoUrl: "/marketplace",
  },

  {
    id: "rfq-engine",
    title: "Automated RFQ Bidding Engine",
    subtitle: "Supplier procurement automation",
    description:
      "A competitive bidding system allowing procurement teams to post RFQs and receive real-time supplier bids with automated scoring.",
    category: "Procurement Tech",
    color: "#FF6B35",
    gradient: "from-[#FF6B35] to-[#FF8C5A]",
    emoji: "📋",
    tech: ["React", "Supabase Realtime", "TypeScript", "Next.js"],
    features: [
      "Real-time bid notifications",
      "Automated lowest-bid highlighting",
      "Bid acceptance workflow",
      "Deadline enforcement",
      "Supplier performance tracking",
    ],
    metrics: [
      { label: "Avg Bids", value: "6.4" },
      { label: "Savings", value: "23%" },
      { label: "Processing", value: "-80%" },
    ],
  },

  {
    id: "payment-gateway",
    title: "Multi-Gateway Payment Hub",
    subtitle: "Unified payment orchestration",
    description:
      "A payment processing layer supporting Stripe, PayPal, and M-Pesa with currency conversion and payment verification.",
    category: "FinTech",
    color: "#00D4AA",
    gradient: "from-[#00D4AA] to-[#00B894]",
    emoji: "💳",
    tech: [
      "Stripe API",
      "PayPal SDK",
      "IntaSend",
      "Zod",
      "Next.js",
    ],
    features: [
      "Stripe PaymentIntents",
      "M-Pesa STK Push",
      "Credit terms calculation",
      "Webhook verification",
      "Fraud protection",
    ],
    metrics: [
      { label: "Methods", value: "3+" },
      { label: "Success", value: "99.2%" },
      { label: "Speed", value: "<2s" },
    ],
  },

  {
    id: "seller-rankings",
    title: "Live Seller Intelligence Dashboard",
    subtitle: "Real-time analytics & rankings",
    description:
      "Seller performance analytics with ranking systems, filters, and marketplace intelligence.",
    category: "Analytics",
    color: "#FFB800",
    gradient: "from-[#FFB800] to-[#FF8C00]",
    emoji: "🏆",
    tech: [
      "Next.js",
      "Supabase",
      "Lucide",
      "Realtime Polling",
    ],
    features: [
      "Live seller rankings",
      "Category filtering",
      "Sales aggregation",
      "Rank tracking",
    ],
    metrics: [
      { label: "Sellers", value: "200+" },
      { label: "Refresh", value: "30s" },
      { label: "Metrics", value: "12" },
    ],
  },

  {
    id: "order-tracking",
    title: "Real-Time Order Tracking System",
    subtitle: "GPS logistics visibility",
    description:
      "Interactive logistics tracking with maps, delivery timeline, and driver communication.",
    category: "Logistics Tech",
    color: "#FF4D8D",
    gradient: "from-[#FF4D8D] to-[#FF6B9D]",
    emoji: "🗺️",
    tech: [
      "React Leaflet",
      "OpenStreetMap",
      "Next.js",
      "Supabase",
    ],
    features: [
      "Live route visualization",
      "Delivery timeline",
      "Driver contact",
      "Location tracking",
    ],
    metrics: [
      { label: "Hubs", value: "5" },
      { label: "Accuracy", value: "±100m" },
      { label: "Updates", value: "15min" },
    ],
  },

  {
    id: "social-media-api",
    title: "Multi-Platform Social API",
    subtitle: "Cross-platform publishing",
    description:
      "Unified publishing API for social platforms with media upload and automated posting.",
    category: "Social Tech",
    color: "#36CFFF",
    gradient: "from-[#36CFFF] to-[#00B0E0]",
    emoji: "📢",
    tech: [
      "Twitter API",
      "Facebook Graph API",
      "Instagram API",
      "Next.js",
    ],
    features: [
      "Multi-platform posting",
      "Media uploads",
      "Error recovery",
      "Character limits",
    ],
    metrics: [
      { label: "Platforms", value: "3" },
      { label: "Media", value: "4" },
      { label: "Speed", value: "<3s" },
    ],
  },
];

const categories = [
  "All",
  "B2B Marketplace",
  "FinTech",
  "Analytics",
  "Logistics Tech",
  "Procurement Tech",
  "Social Tech",
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");

  const [expandedProject, setExpandedProject] =
    useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (p) => p.category === activeCategory
        );

  return (
    <section
      id="portfolio"
      className="relative py-24 bg-[#08090F]"
    >
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <Code2 className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span className="text-[#A0A3C4]">
              Real Projects. Real Results.
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Our <span className="gradient-text">Portfolio</span>
          </h2>

          <p className="mt-5 text-[#A0A3C4] text-lg">
            Production-grade software built to scale.
          </p>
        </div>


        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                activeCategory === cat
                  ? "bg-[#6C47FF] text-white"
                  : "glass text-[#A0A3C4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>


        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map((project) => (

            <div
              key={project.id}
              className="bg-[#0D0F1E] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
            >

              <div
                className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
              >
                <div className="text-6xl">
                  {project.emoji}
                </div>
              </div>


              <div className="p-6 flex flex-col flex-1">

                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>

                <p className="text-sm text-[#A0A3C4] mb-4">
                  {project.subtitle}
                </p>


                <p className="text-sm text-[#A0A3C4] mb-5">
                  {project.description}
                </p>


                <div className="grid grid-cols-3 gap-2 mb-5">
                  {project.metrics.map((m)=>(
                    <div
                      key={m.label}
                      className="bg-white/5 rounded-xl p-2 text-center"
                    >
                      <div className="text-white font-bold">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>


                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t)=>(
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{
                        background:`${project.color}20`,
                        color:project.color
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>


                {expandedProject === project.id && (
                  <div className="mb-5 space-y-2">
                    {project.features.map((f)=>(
                      <p
                        key={f}
                        className="text-sm text-[#A0A3C4]"
                      >
                        • {f}
                      </p>
                    ))}
                  </div>
                )}


                <div className="flex gap-2 mt-auto">

                  <button
                    onClick={() =>
                      setExpandedProject(
                        expandedProject === project.id
                          ? null
                          : project.id
                      )
                    }
                    className="flex-1 border border-white/10 rounded-xl py-2 text-sm text-white"
                  >
                    {expandedProject === project.id
                      ? "Less"
                      : "Features"}
                  </button>


                  {project.demoUrl ? (

                    <Link
                      href={project.demoUrl}
                      className="flex-1 flex justify-center items-center gap-2 rounded-xl text-white font-bold"
                      style={{
                        background:project.color
                      }}
                    >
                      <Play size={14}/>
                      Demo
                    </Link>

                  ) : (

                    <Link
                      href="/#contact"
                      className="flex-1 flex justify-center items-center gap-2 rounded-xl text-white font-bold"
                      style={{
                        background:project.color
                      }}
                    >
                      <ArrowRight size={14}/>
                      Contact
                    </Link>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>


        <div className="text-center mt-16">
          <Link
            href="/#contact"
            className="btn-brand px-8 py-4 rounded-2xl inline-flex items-center gap-2 text-white font-bold"
          >
            Start Your Project
            <ArrowRight size={16}/>
          </Link>
        </div>


      </div>
    </section>
  );
}