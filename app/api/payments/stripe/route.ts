import { NextRequest, NextResponse } from 'next/server';
import { createStripePaymentIntent, verifyPayment } from '@/lib/payments';
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

    const result = await createStripePaymentIntent({
      amount: validatedData.amount,
      currency: validatedData.currency,
      description: 'B2B Purchase from Tony\'s Global',
      metadata: { provider: 'stripe' },
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
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  const result = await verifyPayment(paymentId, 'stripe');
  
  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
