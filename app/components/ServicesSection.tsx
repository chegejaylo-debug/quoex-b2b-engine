import {
  ShoppingBag,
  Brain,
  BarChart3,
  Globe,
  Lock,
  Smartphone,
  ArrowRight,
  Check,
} from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    color: "#6C47FF",
    title: "B2B Marketplace Platforms",
    description:
      "End-to-end multi-vendor marketplaces with wholesale pricing, RFQ systems, supplier bidding, and procurement workflows.",
    features: [
      "Multi-vendor catalog management",
      "Tiered wholesale pricing engine",
      "RFQ & bidding system",
      "Freight & logistics integration",
    ],
    tag: "Most Popular",
  },
  {
    icon: Brain,
    color: "#FF6B35",
    title: "AI-Powered SaaS Products",
    description:
      "Custom AI integrations — chatbots, recommendation engines, automated pricing, and intelligent workflow automation.",
    features: [
      "LLM-powered chat assistants",
      "Predictive analytics dashboards",
      "Automated business workflows",
      "Real-time data pipelines",
    ],
    tag: "Trending",
  },
  {
    icon: BarChart3,
    color: "#00D4AA",
    title: "Enterprise ERP & Dashboards",
    description:
      "Comprehensive business intelligence platforms with real-time metrics, inventory management, and role-based access control.",
    features: [
      "Custom reporting dashboards",
      "Multi-warehouse inventory",
      "Role-based access control",
      "PDF invoice generation",
    ],
    tag: null,
  },
  {
    icon: Globe,
    color: "#FF4D8D",
    title: "Payment & FinTech Integration",
    description:
      "Multi-gateway payment systems supporting Stripe, M-Pesa, PayPal, and custom payment workflows for African markets.",
    features: [
      "Stripe, PayPal, M-Pesa",
      "Subscription billing",
      "Credit terms management",
      "Multi-currency support",
    ],
    tag: null,
  },
  {
    icon: Lock,
    color: "#FFB800",
    title: "Security & Auth Systems",
    description:
      "Enterprise-grade authentication, authorization, RBAC, and security hardening for production applications.",
    features: [
      "Clerk / Supabase Auth",
      "Rate limiting & CSRF protection",
      "CSP & security headers",
      "Audit logs & compliance",
    ],
    tag: null,
  },
  {
    icon: Smartphone,
    color: "#36CFFF",
    title: "Mobile-First Web Apps",
    description:
      "Fully responsive, PWA-ready web applications that deliver a native mobile experience on any device.",
    features: [
      "PWA & offline support",
      "Mobile-optimized UX",
      "Push notifications",
      "App Store deployment",
    ],
    tag: null,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 bg-[#05060F]">
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[#A0A3C4]">What We Build</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Full-Stack Services For{" "}
            <span className="gradient-text">Enterprise Clients</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg leading-relaxed">
            From concept to production, we deliver robust, scalable software that drives real business outcomes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-[#0D0F1E] border border-white/7 rounded-2xl p-6 transition-all duration-300 card-glow hover:border-white/15"
              >
                {service.tag && (
                  <div
                    className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ background: `${service.color}20`, color: service.color }}
                  >
                    {service.tag}
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: service.color }} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-[#A0A3C4] leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#A0A3C4]">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: service.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className="mt-6 flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5" style={{ color: service.color }}>
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
