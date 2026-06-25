import { NextRequest, NextResponse } from 'next/server';
import { getSellerRankings } from '@/lib/rankings';
import { rateLimit, validateOrigin, securityHeaders, cspHeader } from '@/lib/security';

export async function GET(request: NextRequest) {
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
    const rankings = await getSellerRankings();

    const response = NextResponse.json({ success: true, rankings });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  } catch (error) {
    console.error('Rankings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
