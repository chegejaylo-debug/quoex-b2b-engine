import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import OnboardingForm from "./OnboardingForm";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 bg-[#05060F]">
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6C47FF] animate-pulse" />
            <span className="text-[#A0A3C4]">Start Your Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Extraordinary</span>
          </h2>
          <p className="mt-5 text-[#A0A3C4] text-lg leading-relaxed">
            Fill in your project brief below. We&apos;ll review it and send a detailed proposal within 4 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form — takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="glass-strong rounded-2xl p-6 sm:p-8">
              <OnboardingForm />
            </div>
          </div>

          {/* Contact info — takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MessageCircle,
                    color: "#25D366",
                    label: "WhatsApp",
                    value: "+254 757 528 133",
                    href: "https://wa.me/254757528133",
                    desc: "Fastest response — usually under 1 hour",
                  },
                  {
                    icon: Mail,
                    color: "#6C47FF",
                    label: "Email",
                    value: "hello@quoex.dev",
                    href: "mailto:hello@quoex.dev",
                    desc: "For detailed project briefs and proposals",
                  },
                  {
                    icon: Phone,
                    color: "#FF6B35",
                    label: "Phone",
                    value: "+254 757 528 133",
                    href: "tel:+254757528133",
                    desc: "Available Mon–Fri, 8am–6pm EAT",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${item.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-xs text-[#6B6F8E] font-medium">{item.label}</div>
                        <div className="text-sm font-bold text-white group-hover:text-[#6C47FF] transition-colors">
                          {item.value}
                        </div>
                        <div className="text-xs text-[#6B6F8E] mt-0.5">{item.desc}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[#6C47FF]" />
                <h4 className="text-sm font-bold text-white">Response Times</h4>
              </div>
              <div className="space-y-3">
                {[
                  { channel: "WhatsApp", time: "< 1 hour", color: "#25D366" },
                  { channel: "Project Inquiry Form", time: "< 4 hours", color: "#6C47FF" },
                  { channel: "Email", time: "< 24 hours", color: "#FF6B35" },
                  { channel: "Proposal Delivery", time: "24–48 hours", color: "#00D4AA" },
                ].map((r) => (
                  <div key={r.channel} className="flex items-center justify-between">
                    <span className="text-sm text-[#A0A3C4]">{r.channel}</span>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg"
                      style={{ background: `${r.color}15`, color: r.color }}
                    >
                      {r.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                <h4 className="text-sm font-bold text-white">Based In</h4>
              </div>
              <p className="text-sm text-[#A0A3C4]">Nairobi, Kenya</p>
              <p className="text-xs text-[#6B6F8E] mt-1">Serving clients globally · Remote-first team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
