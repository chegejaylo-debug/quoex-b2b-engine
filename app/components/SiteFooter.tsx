import Link from "next/link";
import { Zap, Heart } from "lucide-react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

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
                Let&apos;s turn your idea into production-grade software.
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
              <Link
                href="/#contact"
                className="btn-brand px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Start a Project
              </Link>
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
                { icon: TwitterIcon, href: "#", label: "Twitter" },
                { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
                { icon: GithubIcon, href: "#", label: "GitHub" },
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
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto");
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-[#6B6F8E] hover:text-[#A0A3C4] transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                          className="text-sm text-[#6B6F8E] hover:text-[#A0A3C4] transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
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
