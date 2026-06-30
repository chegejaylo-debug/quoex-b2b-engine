import Link from "next/link";
import { Zap, Twitter, Linkedin, Github, Heart } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "B2B Marketplace", href: "#services" },
    { label: "SaaS Platforms", href: "#services" },
    { label: "AI Integration", href: "#services" },
    { label: "Payment Systems", href: "#services" },
    { label: "Mobile Apps", href: "#services" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Marketplace Demo", href: "/marketplace" },
  ],
  Resources: [
    { label: "Start a Project", href: "#contact" },
    { label: "WhatsApp Us", href: "https://wa.me/254757528133" },
    { label: "Email Us", href: "mailto:hello@quoex.dev" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const techStack = [
  "Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS",
  "Stripe", "M-Pesa", "OpenAI", "Clerk", "Vercel",
];

export default function SiteFooter() {
  return (
    <footer className="relative bg-[#03040A] border-t border-white/7">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top CTA bar */}
        <div className="py-12 border-b border-white/7">
          <div className="glass-strong rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-black text-white">
                Ready to build your next platform?
              </h3>
              <p className="text-[#A0A3C4] mt-1">
                Let's turn your idea into production-grade software.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/254757528133?text=Hi%2C%20I%27d%20like%20to%20start%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                WhatsApp Us
              </a>
              <a
                href="#contact"
                className="btn-brand px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Start a Project
              </a>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black text-white">Quoex Technologies</span>
            </div>
            <p className="text-sm text-[#A0A3C4] leading-relaxed max-w-xs mb-6">
              Building enterprise-grade B2B software for ambitious companies across Africa and beyond.
              From idea to launch in weeks, not months.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#A0A3C4]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-[#6B6F8E] hover:text-[#A0A3C4] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech strip */}
        <div className="py-6 border-t border-white/7">
          <p className="text-xs text-[#4A4E6A] font-semibold uppercase tracking-widest text-center mb-4">
            Built With
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs text-[#6B6F8E] border border-white/7 hover:border-white/15 hover:text-[#A0A3C4] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A4E6A]">
          <span>© 2026 Quoex Technologies. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-[#FF4D8D] fill-[#FF4D8D]" /> in Nairobi, Kenya
          </span>
          <span>VAT/TIN: Available on invoice</span>
        </div>
      </div>
    </footer>
  );
}
