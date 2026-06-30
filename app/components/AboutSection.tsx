import { Target, Heart, Globe, Award, Code2, Users } from "lucide-react";

const values = [
  {
    icon: Code2,
    color: "#6C47FF",
    title: "Engineering First",
    description: "We write clean, documented, production-grade code. No shortcuts. No technical debt.",
  },
  {
    icon: Target,
    color: "#FF6B35",
    title: "Outcome Focused",
    description: "We measure success by your business results, not just lines of code shipped.",
  },
  {
    icon: Globe,
    color: "#00D4AA",
    title: "Built for Africa & Beyond",
    description: "Deep understanding of African markets — M-Pesa, local logistics, regional payment rails.",
  },
  {
    icon: Heart,
    color: "#FF4D8D",
    title: "Long-Term Partnership",
    description: "We don't disappear after launch. We grow alongside your business as a trusted tech partner.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "Founded",
    description: "Started with a vision to bring Silicon Valley-quality engineering to African businesses.",
  },
  {
    year: "2023",
    title: "First Enterprise Client",
    description: "Delivered a full B2B procurement platform for a Nairobi-based construction company.",
  },
  {
    year: "2024",
    title: "10 Countries Served",
    description: "Expanded our client base to cover East Africa, the Middle East, and Southeast Asia.",
  },
  {
    year: "2025",
    title: "AI Integration Practice",
    description: "Launched our AI/LLM integration service, adding intelligence to every platform we build.",
  },
  {
    year: "2026",
    title: "50+ Platforms Shipped",
    description: "Now operating as a full product engineering firm with a global client portfolio.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-[#05060F]">
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <Users className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="text-[#A0A3C4]">Who We Are</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            The Engineering Team{" "}
            <span className="gradient-text">Behind the Code</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Story */}
          <div>
            <div className="space-y-5 text-[#A0A3C4] text-base leading-relaxed">
              <p>
                <span className="text-white font-bold">Quoex Technologies</span> was born from frustration.
                We watched African businesses struggle with outdated software, cookie-cutter templates,
                and overseas developers who didn't understand local market realities.
              </p>
              <p>
                We set out to build something different — an engineering firm with deep roots in African
                commerce, a global technology stack, and an uncompromising obsession with quality.
              </p>
              <p>
                Today we're a tight-knit team of full-stack engineers, UI/UX designers, and product
                strategists who have shipped over 50 production platforms for clients across Africa,
                the Middle East, and beyond.
              </p>
              <p>
                Every project we take on becomes a personal mission. We don't just build software —
                we build the infrastructure that powers your business growth.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Years of Experience", value: "4+" },
                { icon: Globe, label: "Countries Served", value: "12+" },
                { icon: Code2, label: "Lines of Code", value: "2M+" },
                { icon: Users, label: "Happy Clients", value: "50+" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="glass rounded-xl p-4">
                    <Icon className="w-5 h-5 text-[#6C47FF] mb-2" />
                    <div className="text-2xl font-black text-white">{item.value}</div>
                    <div className="text-xs text-[#6B6F8E] mt-0.5">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-bold text-white mb-8">Our Journey</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#6C47FF] via-[#FF6B35] to-transparent" />
              <div className="space-y-6">
                {timeline.map((item, i) => (
                  <div key={item.year} className="flex gap-6">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0D0F1E] border-2 border-[#6C47FF] flex items-center justify-center text-[10px] font-black text-[#6C47FF] z-10 relative">
                        {item.year.slice(2)}
                      </div>
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#6C47FF]">{item.year}</span>
                        <span className="text-sm font-bold text-white">{item.title}</span>
                      </div>
                      <p className="text-sm text-[#A0A3C4]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-center text-2xl font-black text-white mb-10">What We Stand For</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-[#0D0F1E] border border-white/7 rounded-2xl p-6 text-center card-glow transition-all duration-300 hover:border-white/15"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${v.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: v.color }} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{v.title}</h4>
                  <p className="text-xs text-[#A0A3C4] leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
