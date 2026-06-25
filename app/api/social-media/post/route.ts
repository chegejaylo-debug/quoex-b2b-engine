import { NextRequest, NextResponse } from 'next/server';
import { postToSocialMedia } from '@/lib/social-media';
import { rateLimit, validateOrigin, securityHeaders, cspHeader } from '@/lib/security';
import { socialPostSchema } from '@/lib/security';

export async function POST(request: NextRequest) {
  // Security checks
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = rateLimit(ip, { maxRequests: 20, windowMs: 3600000 }); // 20 posts per hour
  
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validatedData = socialPostSchema.parse(body);

    const results = await postToSocialMedia(validatedData);

    const response = NextResponse.json({ success: true, results });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  } catch (error) {
    console.error('Social media post error:', error);
    return NextResponse.json({ error: 'Failed to post to social media' }, { status: 500 });
  }
}
