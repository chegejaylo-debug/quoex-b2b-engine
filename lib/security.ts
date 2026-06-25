import { z } from 'zod';
import { NextRequest } from 'next/server';

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Rate limiting middleware
export function rateLimit(identifier: string, config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { success: true, remaining: config.maxRequests - 1 };
  }

  if (record.count >= config.maxRequests) {
    return {
      success: false,
      error: 'Rate limit exceeded',
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return { success: true, remaining: config.maxRequests - record.count };
}

// CSRF Token generation and validation
const csrfTokens = new Map<string, { token: string; expires: number }>();

export function generateCSRFToken(sessionId: string): string {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 3600000, // 1 hour
  });
  
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const record = csrfTokens.get(sessionId);
  
  if (!record) return false;
  if (Date.now() > record.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return record.token === token;
}

// Input validation schemas using Zod
export const productSchema = z.object({
  name: z.string().min(1).max(500).trim(),
  category: z.enum(['Cement', 'Drills', 'Paint', 'Electrical', 'Plumbing']),
  price: z.number().positive(),
  image_url: z.string().url().optional().nullable(),
});

export const rfqSchema = z.object({
  description: z.string().min(10).max(5000).trim(),
  targetBudget: z.string().regex(/^\d+([,]\d{3})*(\.\d{1,2})?$/).optional(),
  urgency: z.enum(['Urgent Dispatch Needed (Within 24 Hours)', 'Standard (3-5 Days)', 'Forward Sourcing Planning (30+ Days)']),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['KES', 'USD', 'EUR', 'GBP']),
  provider: z.enum(['stripe', 'paypal', 'mpesa']),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/).optional(),
});

export const socialPostSchema = z.object({
  text: z.string().min(1).max(280).trim(),
  media: z.array(z.string().url()).max(4).optional(),
  platforms: z.array(z.enum(['twitter', 'facebook', 'instagram'])).min(1),
});

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 10000);
}

// Validate request origin
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://tonys-global.vercel.app',
  ];
  
  return allowedOrigins.includes(origin || '');
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Content Security Policy
export const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self'",
  "connect-src 'self' https://api.stripe.com https://graph.facebook.com https://upload.twitter.com",
  "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://www.facebook.com",
].join('; ');
