"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong py-3 shadow-2xl shadow-black/50"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] flex items-center justify-center shadow-lg group-hover:shadow-[#6C47FF]/40 transition-shadow">
              <Zap className="w-5 h-5 text-white fill-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] opacity-0 group-hover:opacity-100 blur-lg transition-opacity -z-10" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Quoex
              </span>
              <span className="hidden sm:inline text-xs text-[#A0A3C4] font-medium ml-1.5">
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                className="px-4 py-2 text-sm font-medium text-[#A0A3C4] hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/marketplace"
              className="px-4 py-2 text-sm font-medium text-[#A0A3C4] hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              Marketplace
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#contact"
              className="btn-brand px-5 py-2.5 rounded-xl text-sm font-semibold inline-block"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-full bg-[#0D0F1E] border-l border-white/10 p-6 flex flex-col animate-slideDown">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-lg font-black text-white">Quoex</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5 text-[#A0A3C4]" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-left px-4 py-3 rounded-xl text-base font-medium text-[#A0A3C4] hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/marketplace"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium text-[#A0A3C4] hover:text-white hover:bg-white/5 transition-all"
              >
                Marketplace
              </Link>
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="btn-brand w-full px-5 py-3 rounded-xl text-sm font-semibold text-center inline-block"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
