"use client";

import { useState } from "react";
import { ExternalLink, Github, Play, Code2, Layers, Users, TrendingUp, ArrowRight } from "lucide-react";

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
  caseStudy?: string;
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
    tech: ["Next.js 15", "Supabase", "Tailwind CSS", "Stripe", "M-Pesa", "Leaflet"],
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
      "A competitive bidding system that allows procurement teams to post RFQs and receive real-time bids from verified suppliers, with automated bid scoring and awarding.",
    category: "Procurement Tech",
    color: "#FF6B35",
    gradient: "from-[#FF6B35] to-[#FF8C5A]",
    emoji: "📋",
    tech: ["React", "Supabase Realtime", "TypeScript", "Next.js API Routes"],
    features: [
      "Real-time bid notifications",
      "Automated lowest-bid highlighting",
      "Bid acceptance and rejection workflow",
      "Deadline enforcement system",
      "Category-based RFQ routing",
      "Supplier performance tracking",
    ],
    metrics: [
      { label: "Avg. Bids Per RFQ", value: "6.4" },
      { label: "Cost Savings", value: "23%" },
      { label: "Processing Time", value: "-80%" },
    ],
  },
  {
    id: "payment-gateway",
    title: "Multi-Gateway Payment Hub",
    subtitle: "Unified payment orchestration",
    description:
      "A unified payment processing layer supporting Stripe, PayPal, and M-Pesa (via IntaSend) with automatic currency conversion, credit terms, and payment verification.",
    category: "FinTech",
    color: "#00D4AA",
    gradient: "from-[#00D4AA] to-[#00B894]",
    emoji: "💳",
    tech: ["Stripe API", "PayPal SDK", "IntaSend (M-Pesa)", "Zod Validation", "Next.js"],
    features: [
      "Stripe PaymentIntents with automatic methods",
      "M-Pesa STK push via IntaSend",
      "Net-30/60/90 credit terms with fee calculation",
      "Payment status verification webhooks",
      "Multi-currency support",
      "Rate limiting and fraud prevention",
    ],
    metrics: [
      { label: "Payment Methods", value: "3+" },
      { label: "Success Rate", value: "99.2%" },
      { label: "Avg Processing", value: "<2s" },
    ],
  },
  {
    id: "seller-rankings",
    title: "Live Seller Intelligence Dashboard",
    subtitle: "Real-time analytics & rankings",
    description:
      "A live seller performance ranking system with real-time data refresh, category/region filtering, and comprehensive sales analytics for marketplace administrators.",
    category: "Analytics",
    color: "#FFB800",
    gradient: "from-[#FFB800] to-[#FF8C00]",
    emoji: "🏆",
    tech: ["Next.js", "Supabase Aggregations", "Lucide Icons", "Real-time Polling"],
    features: [
      "Live rankings updated every 30 seconds",
      "Trophy badges for top 3 performers",
      "Category and region filtering",
      "Rank change tracking",
      "Total sales volume aggregation",
      "Average order value computation",
    ],
    metrics: [
      { label: "Sellers Tracked", value: "200+" },
      { label: "Refresh Rate", value: "30s" },
      { label: "Data Points", value: "12" },
    ],
  },
  {
    id: "order-tracking",
    title: "Real-Time Order Tracking System",
    subtitle: "GPS-enabled logistics visibility",
    description:
      "An interactive order tracking interface with live map visualization, delivery timeline, and driver communication — integrated into the full B2B procurement workflow.",
    category: "Logistics Tech",
    color: "#FF4D8D",
    gradient: "from-[#FF4D8D] to-[#FF6B9D]",
    emoji: "🗺️",
    tech: ["React-Leaflet", "OpenStreetMap", "Next.js", "Supabase", "Lucide Icons"],
    features: [
      "Interactive route visualization on OpenStreetMap",
      "5-step delivery status timeline",
      "Driver name and contact display",
      "Estimated delivery calculation",
      "Current location marker with popup",
      "Multi-hub route rendering",
    ],
    metrics: [
      { label: "Logistics Hubs", value: "5" },
      { label: "Accuracy", value: "±100m" },
      { label: "Update Interval", value: "15min" },
    ],
  },
  {
    id: "social-media-api",
    title: "Multi-Platform Social API",
    subtitle: "Cross-platform content publishing",
    description:
      "A unified social media publishing API supporting Twitter/X, Facebook Pages, and Instagram Business, with media upload, multi-platform posting, and error handling.",
    category: "Social Tech",
    color: "#36CFFF",
    gradient: "from-[#36CFFF] to-[#00B0E0]",
    emoji: "📢",
    tech: ["Twitter API v2", "Facebook Graph API", "Instagram Graph API", "Next.js"],
    features: [
      "Simultaneous multi-platform posting",
      "Image media upload to Twitter v1",
      "Facebook Page feed management",
      "Instagram Business media container workflow",
      "Character count enforcement",
      "Platform-specific error recovery",
    ],
    metrics: [
      { label: "Platforms", value: "3" },
      { label: "Media Types", value: "4 max" },
      { label: "Avg Post Time", value: "<3s" },
    ],
  },
];

const categories = ["All", "B2B Marketplace", "FinTech", "Analytics", "Logistics Tech", "Procurement Tech", "Social Tech"];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-24 bg-[#08090F]">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <Code2 className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span className="text-[#A0A3C4]">Real Projects. Real Results.</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg leading-relaxed">
            Every project we ship is production-grade, performance-optimized, and built to scale.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#6C47FF] text-white shadow-lg shadow-[#6C47FF]/30"
                  : "glass text-[#A0A3C4] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group bg-[#0D0F1E] border border-white/7 rounded-2xl overflow-hidden card-glow transition-all duration-300 hover:border-white/15 flex flex-col"
            >
              {/* Project header visual */}
              <div
                className={`relative h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="text-6xl animate-float">{project.emoji}</div>
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{ background: "rgba(0,0,0,0.4)", color: "#fff" }}
                >
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                <p className="text-xs text-[#A0A3C4] font-semibold mb-3">{project.subtitle}</p>
                <p className="text-sm text-[#A0A3C4] leading-relaxed mb-4 flex-1">{project.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="bg-white/4 rounded-xl p-2.5 text-center">
                      <div className="text-base font-black text-white">{m.value}</div>
                      <div className="text-[9px] text-[#6B6F8E] font-medium mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      style={{ background: `${project.color}15`, color: project.color }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expand features */}
                {expandedProject === project.id && (
                  <div className="mb-4 space-y-1.5 animate-slideUp">
                    {project.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-[#A0A3C4]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.color }} />
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    className="flex-1 text-center py-2 rounded-xl border border-white/10 text-sm font-semibold text-[#A0A3C4] hover:border-white/20 hover:text-white transition-all"
                  >
                    {expandedProject === project.id ? "Less" : "Features"}
                  </button>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: `${project.color}` }}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Live Demo
                    </a>
                  ) : (
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: project.color }}
                      onClick={() => {
                        const el = document.querySelector("#contact");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Inquire
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#A0A3C4] mb-4">Have a project in mind? Let's talk.</p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-brand px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center gap-2"
          >
            Start Your Project <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
