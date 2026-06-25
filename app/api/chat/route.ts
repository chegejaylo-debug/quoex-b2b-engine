import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  // Hardware-specific knowledge base for the AI
  const systemPrompt = `You are Tony, the AI assistant for Tonys Hardware in Nyeri. 
  Location: Gakere Road, Nyeri. Products: Cement, Paint, Power tools, Plumbing.
  Tone: Professional, helpful, and local. If you don't know a price, ask them to visit the store.`;

  // For a real app, you'd call OpenAI here. 
  // This is a professional simulation that works immediately:
  const responses: Record<string, string> = {
    "hello": "Hello! Welcome to Tonys Hardware Nyeri. How can I help you build today?",
    "paint": "We stock Crown and Duracoat paints in all colors. Would you like a price list?",
    "location": "We are located on Gakere Road, Nyeri town, near the main stage.",
    "delivery": "Yes! We offer free delivery within Nyeri town for orders above 10,000 KES."
  };

  const reply = responses[message.toLowerCase()] || "That's a great question! For specific stock availability on that, please call us directly or visit our Gakere Road branch. Can I help with anything else?";

  return NextResponse.json({ text: reply });
}