import { NextRequest, NextResponse } from 'next/server';
import { getOrderTracking } from '@/lib/tracking';
import { rateLimit, validateOrigin, securityHeaders, cspHeader } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  // Security checks
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = rateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const orderId = params.orderId;
    const trackingData = await getOrderTracking(orderId);

    if (trackingData) {
      const response = NextResponse.json({ success: true, tracking: trackingData });
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      response.headers.set('Content-Security-Policy', cspHeader);
      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}
