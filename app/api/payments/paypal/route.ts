import { NextRequest, NextResponse } from 'next/server';
import { createPayPalPayment } from '@/lib/payments';
import { rateLimit, validateOrigin, securityHeaders, cspHeader } from '@/lib/security';
import { paymentSchema } from '@/lib/security';

export async function POST(request: NextRequest) {
  // Security checks
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = rateLimit(ip, { maxRequests: 10, windowMs: 60000 });
  
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const result = await createPayPalPayment({
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: 'B2B Purchase from Tony\'s Global',
    });

    if (result.success) {
      const response = NextResponse.json(result);
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      response.headers.set('Content-Security-Policy', cspHeader);
      return response;
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('PayPal payment error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
