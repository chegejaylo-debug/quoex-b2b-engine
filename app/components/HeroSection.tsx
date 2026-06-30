"use client";

import { ArrowRight, Play, Star, TrendingUp, Shield, Zap } from "lucide-react";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "12+", label: "Countries Served" },
  { value: "$2M+", label: "Revenue Generated" },
];

const trustedBy = ["Alibaba-Style B2B", "SaaS Platforms", "FinTech Solutions", "AI Marketplaces", "ERP Systems"];

export default function HeroSection({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-[#05060F]" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C47FF] rounded-full blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FF6B35] rounded-full blur-[100px] opacity-15 animate-float delay-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-slideUp">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#6C47FF] animate-pulse" />
            <span className="text-[#A0A3C4]">Now accepting new projects for Q3 2026</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#6C47FF]" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight animate-slideUp delay-100">
            <span className="text-white">We Build </span>
            <span className="gradient-text">Enterprise-Grade</span>
            <br />
            <span className="text-white">B2B Software</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#A0A3C4] max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Full-stack B2B marketplaces, AI-powered SaaS platforms, and custom enterprise solutions.
            We turn complex business problems into elegant, scalable software.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp delay-300">
            <button
              onClick={onCTAClick}
              className="btn-brand w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 group"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const el = document.querySelector("#portfolio");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-outline w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-[#6C47FF]" />
              View Our Work
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#6B6F8E] animate-slideUp delay-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#6C47FF]" /> NDA Protected
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FF6B35]" /> Fast Delivery
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 5-Star Rated
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slideUp delay-400">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="glass rounded-2xl p-5 text-center card-glow transition-all duration-300"
            >
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-[#A0A3C4] mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tech strip */}
        <div className="mt-16 text-center animate-slideUp delay-500">
          <p className="text-xs text-[#6B6F8E] uppercase tracking-widest font-semibold mb-5">
            Specialising In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {trustedBy.map((item) => (
              <span
                key={item}
                className="glass px-4 py-2 rounded-full text-sm text-[#A0A3C4] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B6F8E] animate-float">
        <span className="text-xs font-medium">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#6C47FF] rounded-full animate-float" />
        </div>
      </div>
    </section>
  );
}
