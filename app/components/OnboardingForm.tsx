"use client";

import { useState } from "react";
import {
  User, Mail, Phone, Briefcase, DollarSign,
  Calendar, FileText, CheckCircle, ArrowRight,
  ArrowLeft, Loader2, Building2, Zap
} from "lucide-react";

type FormData = {
  // Step 1 — Contact
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  // Step 2 — Project
  service: string;
  description: string;
  // Step 3 — Budget & Timeline
  budget: string;
  timeline: string;
  priority: string;
  // Step 4 — Requirements
  features: string[];
  extras: string;
};

const SERVICES = [
  { value: "b2b-marketplace", label: "B2B Marketplace", icon: "🏭", color: "#6C47FF" },
  { value: "saas-platform", label: "SaaS Platform", icon: "🚀", color: "#FF6B35" },
  { value: "ai-integration", label: "AI Integration", icon: "🤖", color: "#00D4AA" },
  { value: "erp-dashboard", label: "ERP / Dashboard", icon: "📊", color: "#FFB800" },
  { value: "payment-system", label: "Payment System", icon: "💳", color: "#FF4D8D" },
  { value: "mobile-app", label: "Mobile App", icon: "📱", color: "#36CFFF" },
  { value: "existing-upgrade", label: "Upgrade Existing", icon: "🔧", color: "#A0A3C4" },
  { value: "other", label: "Other / Not Sure", icon: "💡", color: "#6B6F8E" },
];

const BUDGETS = [
  { value: "under-2k", label: "Under $2,000", desc: "MVP / Landing Page" },
  { value: "2k-5k", label: "$2,000 – $5,000", desc: "Starter Project" },
  { value: "5k-15k", label: "$5,000 – $15,000", desc: "Full Platform" },
  { value: "15k-50k", label: "$15,000 – $50,000", desc: "Enterprise System" },
  { value: "50k-plus", label: "$50,000+", desc: "Large-Scale Product" },
  { value: "not-sure", label: "Not Sure Yet", desc: "Needs scoping" },
];

const TIMELINES = [
  { value: "asap", label: "ASAP", desc: "Under 2 weeks" },
  { value: "1-month", label: "1 Month", desc: "Standard delivery" },
  { value: "2-3-months", label: "2–3 Months", desc: "Complex project" },
  { value: "flexible", label: "Flexible", desc: "No rush" },
];

const FEATURE_OPTIONS = [
  "User Authentication", "Admin Dashboard", "Payment Gateway",
  "M-Pesa Integration", "Real-time Features", "Mobile Responsive",
  "AI / Chatbot", "Analytics & Reports", "Multi-language",
  "Order Tracking", "Email Notifications", "WhatsApp Integration",
  "API Integration", "File Uploads", "Search & Filters",
];

const STEPS = ["Contact", "Project", "Budget", "Requirements"];

const emptyForm: FormData = {
  name: "", email: "", whatsapp: "", company: "",
  service: "", description: "",
  budget: "", timeline: "", priority: "normal",
  features: [], extras: "",
};

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleFeature = (feature: string) => {
    const current = form.features;
    update("features", current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature]
    );
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.email.includes("@");
    if (step === 1) return form.service && form.description.trim().length >= 20;
    if (step === 2) return form.budget && form.timeline;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "onboarding_form", timestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 px-6 animate-scaleIn">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3">Project Received! 🎉</h3>
        <p className="text-[#A0A3C4] mb-2 max-w-sm mx-auto">
          Thanks, <strong className="text-white">{form.name}</strong>! We've received your project brief and will send a detailed proposal to <strong className="text-white">{form.email}</strong> within 4 business hours.
        </p>
        <p className="text-sm text-[#6B6F8E] mt-4">
          In a hurry? WhatsApp us at{" "}
          <a
            href="https://wa.me/254757528133"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6C47FF] hover:underline"
          >
            +254 757 528 133
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-xs font-semibold transition-all ${
              i === step ? "text-white" : i < step ? "text-[#6C47FF]" : "text-[#4A4E6A]"
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i < step
                  ? "bg-[#6C47FF] text-white"
                  : i === step
                  ? "bg-gradient-to-br from-[#6C47FF] to-[#FF6B35] text-white"
                  : "bg-[#1A1D35] text-[#4A4E6A] border border-white/10"
              }`}>
                {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px transition-all ${i < step ? "bg-[#6C47FF]" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Contact */}
      {step === 0 && (
        <div className="space-y-4 animate-slideUp">
          <h3 className="text-xl font-bold text-white mb-6">Tell us about yourself</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField icon={<User className="w-4 h-4" />} label="Full Name *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="John Kamau"
                className="form-input"
              />
            </FormField>
            <FormField icon={<Building2 className="w-4 h-4" />} label="Company (optional)">
              <input
                type="text"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="BuildRight Ltd"
                className="form-input"
              />
            </FormField>
            <FormField icon={<Mail className="w-4 h-4" />} label="Email Address *">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="john@company.com"
                className="form-input"
              />
            </FormField>
            <FormField icon={<Phone className="w-4 h-4" />} label="WhatsApp Number">
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="form-input"
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Step 1 — Project */}
      {step === 1 && (
        <div className="space-y-6 animate-slideUp">
          <h3 className="text-xl font-bold text-white mb-6">What are you building?</h3>
          <div>
            <label className="block text-sm font-semibold text-[#A0A3C4] mb-3">Service Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SERVICES.map((svc) => (
                <button
                  key={svc.value}
                  type="button"
                  onClick={() => update("service", svc.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.service === svc.value
                      ? "border-[#6C47FF] bg-[#6C47FF]/10 text-white"
                      : "border-white/7 bg-[#0D0F1E] text-[#A0A3C4] hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1.5">{svc.emoji}</div>
                  <div className="text-xs font-semibold">{svc.label}</div>
                </button>
              ))}
            </div>
          </div>
          <FormField icon={<FileText className="w-4 h-4" />} label="Project Description * (min. 20 characters)">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe what you want to build, who the users are, and what problem it solves..."
              rows={4}
              className="form-input resize-none"
            />
            <span className="text-xs text-[#4A4E6A] mt-1 block">{form.description.length} characters</span>
          </FormField>
        </div>
      )}

      {/* Step 2 — Budget & Timeline */}
      {step === 2 && (
        <div className="space-y-6 animate-slideUp">
          <h3 className="text-xl font-bold text-white mb-6">Budget & Timeline</h3>
          <div>
            <label className="block text-sm font-semibold text-[#A0A3C4] mb-3">
              <DollarSign className="w-4 h-4 inline mr-1" />Budget Range *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => update("budget", b.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.budget === b.value
                      ? "border-[#6C47FF] bg-[#6C47FF]/10"
                      : "border-white/7 bg-[#0D0F1E] hover:border-white/20"
                  }`}
                >
                  <div className={`text-sm font-bold ${form.budget === b.value ? "text-white" : "text-[#A0A3C4]"}`}>{b.label}</div>
                  <div className="text-xs text-[#6B6F8E] mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#A0A3C4] mb-3">
              <Calendar className="w-4 h-4 inline mr-1" />Timeline *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TIMELINES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update("timeline", t.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    form.timeline === t.value
                      ? "border-[#6C47FF] bg-[#6C47FF]/10"
                      : "border-white/7 bg-[#0D0F1E] hover:border-white/20"
                  }`}
                >
                  <div className={`text-sm font-bold ${form.timeline === t.value ? "text-white" : "text-[#A0A3C4]"}`}>{t.label}</div>
                  <div className="text-xs text-[#6B6F8E] mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Features */}
      {step === 3 && (
        <div className="space-y-6 animate-slideUp">
          <h3 className="text-xl font-bold text-white mb-6">Required Features</h3>
          <div>
            <label className="block text-sm font-semibold text-[#A0A3C4] mb-3">Select all that apply</label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                    form.features.includes(feature)
                      ? "bg-[#6C47FF] border-[#6C47FF] text-white"
                      : "border-white/10 text-[#A0A3C4] hover:border-white/25 hover:text-white"
                  }`}
                >
                  {form.features.includes(feature) ? "✓ " : ""}{feature}
                </button>
              ))}
            </div>
          </div>
          <FormField icon={<FileText className="w-4 h-4" />} label="Anything else to add? (optional)">
            <textarea
              value={form.extras}
              onChange={(e) => update("extras", e.target.value)}
              placeholder="Any specific integrations, design preferences, competitors to reference, or other requirements..."
              rows={3}
              className="form-input resize-none"
            />
          </FormField>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/40 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/7">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="btn-outline px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-brand px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-40"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-brand px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Zap className="w-4 h-4" /> Submit Project Brief</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-[#A0A3C4] mb-2">
        <span className="text-[#6C47FF]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
