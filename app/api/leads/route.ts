import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().max(20).optional(),
  company: z.string().max(200).optional(),
  service: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
  priority: z.string().max(50).optional(),
  features: z.array(z.string()).optional(),
  extras: z.string().max(2000).optional(),
  source: z.string().max(100).optional(),
  timestamp: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = leadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Save to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        company: data.company,
        service: data.service,
        description: data.description,
        budget: data.budget,
        timeline: data.timeline,
        priority: data.priority,
        features: data.features ? data.features.join(", ") : null,
        extras: data.extras,
        source: data.source || "website",
        status: "new",
        created_at: new Date().toISOString(),
      });

      if (error) {
        // Don't fail the request — just log. Lead is captured.
        console.error("Supabase lead insert error:", error.message);
      }
    }

    // Send WhatsApp notification (optional — only if env is set)
    // You could add Twilio / WhatsApp Business API here

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
    });
  } catch (err: unknown) {
    console.error("Lead capture error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Admin-only: get all leads
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, leads: data });
}
