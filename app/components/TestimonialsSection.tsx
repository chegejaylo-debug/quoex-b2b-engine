import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Mwangi",
    role: "CEO, BuildRight Construction",
    location: "Nairobi, Kenya",
    avatar: "JM",
    color: "#6C47FF",
    rating: 5,
    text:
      "Quoex delivered our B2B procurement platform in just 3 weeks. The wholesale pricing engine and WhatsApp integration have completely transformed how our contractors order materials. Revenue up 40% in the first month.",
    project: "B2B Marketplace",
  },
  {
    name: "Sarah Odhiambo",
    role: "Founder, FarmDirect Africa",
    location: "Kisumu, Kenya",
    avatar: "SO",
    color: "#FF6B35",
    rating: 5,
    text:
      "The RFQ bidding system they built saved us thousands by letting suppliers compete for our business. The mobile-first design means our farmers can use it on basic Android phones. Outstanding work.",
    project: "Agricultural Marketplace",
  },
  {
    name: "David Chen",
    role: "CTO, LogiFlow Systems",
    location: "Singapore",
    avatar: "DC",
    color: "#00D4AA",
    rating: 5,
    text:
      "I was skeptical about hiring a remote team, but Quoex delivered cleaner code than any agency I've worked with in 10 years. The Supabase architecture is rock solid. We're already planning phase 2.",
    project: "Logistics SaaS",
  },
  {
    name: "Amina Hassan",
    role: "Director of Operations, MediSupply",
    location: "Dubai, UAE",
    avatar: "AH",
    color: "#FFB800",
    rating: 5,
    text:
      "The multi-gateway payment integration (Stripe + PayPal + local methods) was exactly what we needed to serve both Western and African customers. Perfect execution, zero bugs at launch.",
    project: "Medical Supply Platform",
  },
  {
    name: "Peter Kamau",
    role: "Managing Director, ElectraHub",
    location: "Mombasa, Kenya",
    avatar: "PK",
    color: "#FF4D8D",
    rating: 5,
    text:
      "The seller rankings dashboard and real-time analytics helped us identify our top suppliers and renegotiate contracts. ROI in 6 weeks. Quoex doesn't just write code — they solve business problems.",
    project: "Electronics B2B",
  },
  {
    name: "Grace Njoroge",
    role: "Founder, PayLink Africa",
    location: "Nairobi, Kenya",
    avatar: "GN",
    color: "#36CFFF",
    rating: 5,
    text:
      "From the first call, the team understood exactly what we needed. They proactively suggested security improvements and performance optimizations we hadn't even thought of. True partners.",
    project: "FinTech Platform",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 bg-[#08090F]">
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[#A0A3C4]">5-Star Client Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Clients Who{" "}
            <span className="gradient-text">Love Our Work</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg leading-relaxed">
            Don't take our word for it. Here's what the people who hired us have to say.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group bg-[#0D0F1E] border border-white/7 rounded-2xl p-6 flex flex-col card-glow transition-all duration-300 hover:border-white/15"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 mb-4 opacity-20" style={{ color: t.color }} />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-[#A0A3C4] leading-relaxed flex-1 mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/7">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: `${t.color}30`, border: `2px solid ${t.color}40` }}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{t.name}</p>
                  <p className="text-xs text-[#6B6F8E] truncate">{t.role}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: `${t.color}15`, color: t.color }}
                >
                  {t.project}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 glass rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Projects Shipped" },
              { value: "100%", label: "On-Time Delivery" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "0", label: "Refund Requests" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-black gradient-text">{item.value}</div>
                <div className="text-sm text-[#A0A3C4] mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
