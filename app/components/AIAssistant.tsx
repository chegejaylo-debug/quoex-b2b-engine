"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Zap, ArrowRight, Bot, User } from "lucide-react";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  time: string;
  options?: string[];
};

type LeadData = {
  name?: string;
  email?: string;
  whatsapp?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  description?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "👋 Hey there! I'm Aria, the Quoex AI assistant.\n\nI can help you understand our services, explore project ideas, and get you started. What brings you here today?",
    time: now(),
    options: [
      "I want to build a B2B marketplace",
      "I need a custom SaaS product",
      "Tell me about your pricing",
      "I have an existing project to upgrade",
    ],
  },
];

const QUICK_RESPONSES: Record<string, { text: string; options?: string[] }> = {
  "I want to build a B2B marketplace": {
    text: "Great choice! B2B marketplaces are our specialty 🏭\n\nWe've built multi-vendor platforms with:\n• Wholesale tiered pricing\n• RFQ & supplier bidding\n• M-Pesa + Stripe payments\n• Order tracking with live maps\n\nTypically 3–6 weeks to production. What industry is your marketplace for?",
    options: ["Construction & Hardware", "Agriculture & Food", "Electronics & Tech", "Healthcare & Pharma", "Other industry"],
  },
  "I need a custom SaaS product": {
    text: "Perfect! SaaS is where we thrive 🚀\n\nWe handle everything from:\n• Product architecture & design\n• Full-stack development\n• AI/LLM integration\n• Payment subscriptions\n• Launch & scaling\n\nWhat problem does your SaaS solve?",
    options: ["Automate a business process", "Connect buyers & sellers", "Analytics & reporting", "Communication & collaboration"],
  },
  "Tell me about your pricing": {
    text: "Our pricing is transparent and fixed 💰\n\n• **Starter**: $2,500 — MVPs & small apps (2 weeks)\n• **Professional**: $8,500 — Full B2B platforms (4 weeks)\n• **Enterprise**: Custom — Large-scale systems\n\nAll include source code ownership, mobile-responsive design, and post-launch support.\n\nWould you like a custom quote for your project?",
    options: ["Get a custom quote", "Tell me more about Starter", "Tell me more about Professional", "What's included in Enterprise?"],
  },
  "I have an existing project to upgrade": {
    text: "We love improving existing platforms! 🔧\n\nWe commonly help with:\n• Adding mobile responsiveness\n• Integrating new payment methods\n• Adding AI features\n• Performance optimization\n• Security hardening\n\nWhat's the main issue you want to solve?",
    options: ["It's not mobile responsive", "I need to add payments", "I want to add AI features", "It's slow or buggy"],
  },
  "Get a custom quote": {
    text: "I'll need a few details to prepare your quote. What's your name?",
    options: [],
  },
  "Construction & Hardware": {
    text: "The construction supply chain is one of our strongest verticals! We've built platforms handling:\n• Cement, steel, and materials wholesale\n• Multiple warehouse management\n• Contractor credit terms (Net 30/60/90)\n• Kenya-specific logistics zones\n\nShall I collect your requirements so our team can prepare a detailed proposal?",
    options: ["Yes, let's start", "Show me a demo first", "Talk to a human first"],
  },
  "Yes, let's start": {
    text: "Excellent! Let's capture your requirements. What's your full name?",
    options: [],
  },
  "Show me a demo first": {
    text: "Great idea! 👇\n\nCheck out our live B2B marketplace demo right here on this page — click **'Marketplace'** in the navigation to see a real platform we've built.\n\nWhen you're ready to discuss your project, just come back here!",
    options: ["I've seen it, let's talk", "What else can I see?"],
  },
  "Talk to a human first": {
    text: "Absolutely! Our team is available on WhatsApp 📱\n\nSend us a message at +254 757 528 133 and we'll respond within 1 business hour.\n\nOr if you prefer email: hello@quoex.dev",
    options: ["Open WhatsApp", "I'll fill in a form instead"],
  },
  "Open WhatsApp": {
    text: "Opening WhatsApp now! Tell them Aria sent you 😊",
    options: [],
  },
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadStep, setLeadStep] = useState<
    null | "name" | "email" | "whatsapp" | "service" | "budget" | "timeline" | "description" | "done"
  >(null);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Show notification bubble after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) setUnread(1);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const addAssistantMessage = (text: string, options?: string[]) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "assistant", text, time: now(), options },
      ]);
      if (!open) setUnread((n) => n + 1);
    }, 900 + Math.random() * 600);
  };

  const handleOption = (option: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: option, time: now() },
    ]);

    if (option === "Open WhatsApp") {
      window.open("https://wa.me/254757528133?text=Hi%2C%20Aria%20sent%20me%21%20I%27d%20like%20to%20discuss%20a%20project.", "_blank");
      addAssistantMessage("WhatsApp opened! Looking forward to chatting with you 🙌", []);
      return;
    }

    if (option === "Yes, let's start" || option === "Get a custom quote" || option === "I'll fill in a form instead") {
      setLeadStep("name");
      addAssistantMessage("Great! Let's get started. What's your full name?", []);
      return;
    }

    const response = QUICK_RESPONSES[option];
    if (response) {
      addAssistantMessage(response.text, response.options);
    } else {
      handleFreeText(option);
    }
  };

  const handleLeadStep = (value: string) => {
    const updated = { ...leadData };

    if (leadStep === "name") {
      updated.name = value;
      setLeadData(updated);
      setLeadStep("email");
      addAssistantMessage(`Nice to meet you, ${value}! 👋\n\nWhat's the best email address for you?`, []);
    } else if (leadStep === "email") {
      updated.email = value;
      setLeadData(updated);
      setLeadStep("whatsapp");
      addAssistantMessage("Got it! WhatsApp number? (We'll use this for quick project updates)", []);
    } else if (leadStep === "whatsapp") {
      updated.whatsapp = value;
      setLeadData(updated);
      setLeadStep("service");
      addAssistantMessage("What type of project do you need?", [
        "B2B Marketplace",
        "SaaS Platform",
        "AI Integration",
        "Mobile App",
        "ERP / Dashboard",
        "Other",
      ]);
    } else if (leadStep === "service") {
      updated.service = value;
      setLeadData(updated);
      setLeadStep("budget");
      addAssistantMessage("What's your approximate budget?", [
        "Under $2,000",
        "$2,000 – $5,000",
        "$5,000 – $15,000",
        "$15,000 – $50,000",
        "$50,000+",
        "Not sure yet",
      ]);
    } else if (leadStep === "budget") {
      updated.budget = value;
      setLeadData(updated);
      setLeadStep("timeline");
      addAssistantMessage("When do you need this ready?", [
        "ASAP (under 2 weeks)",
        "1 month",
        "2–3 months",
        "Flexible timeline",
      ]);
    } else if (leadStep === "timeline") {
      updated.timeline = value;
      setLeadData(updated);
      setLeadStep("description");
      addAssistantMessage("Excellent! Last question — describe your project in a few sentences. What problem does it solve and who are the users?", []);
    } else if (leadStep === "description") {
      updated.description = value;
      setLeadData(updated);
      setLeadStep("done");

      // Submit lead to backend
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updated,
          source: "ai_assistant",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});

      addAssistantMessage(
        `🎉 Thank you, ${updated.name || "there"}!\n\nYour project brief has been sent to our team. Here's a summary:\n\n• **Service**: ${updated.service}\n• **Budget**: ${updated.budget}\n• **Timeline**: ${updated.timeline}\n\nWe'll review your requirements and reach out to **${updated.email}** within 4 business hours with a detailed proposal.\n\nIs there anything else you'd like to know?`,
        ["View our portfolio", "Check pricing", "Nothing for now — thanks!"]
      );
    }
  };

  const handleFreeText = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      addAssistantMessage(
        "Our pricing starts at $2,500 for MVPs and $8,500 for full enterprise platforms. All prices are fixed — no hourly billing, no surprises. Want a detailed breakdown?",
        ["See full pricing", "Get a custom quote"]
      );
    } else if (lower.includes("time") || lower.includes("how long") || lower.includes("when")) {
      addAssistantMessage(
        "Typical timelines:\n• MVP / Landing page: 1–2 weeks\n• Full B2B marketplace: 3–4 weeks\n• Enterprise platform: 6–8 weeks\n\nWe always provide a fixed deadline upfront.",
        ["Get a timeline estimate"]
      );
    } else if (lower.includes("tech") || lower.includes("stack") || lower.includes("framework")) {
      addAssistantMessage(
        "Our core stack:\n• **Frontend**: Next.js 15 (App Router) + Tailwind CSS\n• **Backend**: Supabase (PostgreSQL + Realtime)\n• **Auth**: Clerk or Supabase Auth\n• **Payments**: Stripe, PayPal, M-Pesa (IntaSend)\n• **AI**: OpenAI / Anthropic APIs\n• **Maps**: Leaflet / MapBox",
        ["Tell me more", "This works for my project"]
      );
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      addAssistantMessage(
        `Hello! 👋 Great to meet you. I'm here to help you explore how Quoex can build your next product. What are you looking to create?`,
        INITIAL_MESSAGES[0].options
      );
    } else {
      addAssistantMessage(
        "That's a great question! Our team can give you a much more detailed answer. Would you like me to capture your contact details so someone can get back to you?",
        ["Yes, collect my details", "I'll browse the site first"]
      );
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, time: now() },
    ]);

    if (leadStep && leadStep !== "done") {
      handleLeadStep(text);
    } else {
      handleFreeText(text);
    }
  };

  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/•/g, "·");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-brand flex items-center justify-center shadow-2xl animate-pulse-glow"
        aria-label="Open AI assistant"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6C47FF] to-[#8B6FFF] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Aria</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70">Online · typically replies in seconds</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0D0F1E] min-h-0 max-h-[50vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#6C47FF] to-[#8B6FFF]"
                      : "bg-[#1A1D35] border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#A0A3C4]" />
                  )}
                </div>

                <div className={`flex-1 min-w-0 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
                  <div
                    className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-[#1A1D35] text-[#E0E0F0] rounded-tl-sm"
                        : "bg-[#6C47FF] text-white rounded-tr-sm"
                    }`}
                  >
                    {renderText(msg.text)}
                  </div>
                  <span className="text-[10px] text-[#6B6F8E] mt-1 px-1">{msg.time}</span>

                  {/* Quick options */}
                  {msg.role === "assistant" && msg.options && msg.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOption(opt)}
                          className="px-3 py-1.5 rounded-xl border border-[#6C47FF]/40 text-xs font-medium text-[#A0A3C4] hover:bg-[#6C47FF]/10 hover:text-white hover:border-[#6C47FF]/60 transition-all flex items-center gap-1"
                        >
                          {opt} <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#8B6FFF] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-[#1A1D35] rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#141628] border-t border-white/7">
            <div className="flex items-center gap-2 bg-[#0D0F1E] rounded-xl border border-white/10 px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-[#E0E0F0] placeholder-[#4A4E6A] outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-[#7A58FF]"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-center text-[10px] text-[#4A4E6A] mt-2">
              Powered by Quoex AI · Your data is secure
            </p>
          </div>
        </div>
      )}
    </>
  );
}
