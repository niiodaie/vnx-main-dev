import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter for free tier users (5 requests per minute per IP)
const freeTierLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
});

// Rate limiter for authenticated but still checking (higher limit)
const authLimiter = new RateLimiterMemory({
  points: 100, // Much higher for authenticated users
  duration: 60,
});

export async function checkRateLimit(
  identifier: string,
  isPro: boolean = false
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  // Pro users have unlimited access
  if (isPro) {
    return {
      allowed: true,
      remaining: 999,
      resetIn: 0,
    };
  }

  try {
    // Use free tier limiter for non-pro users
    const rateLimiterRes = await freeTierLimiter.consume(identifier, 1);
    
    return {
      allowed: true,
      remaining: rateLimiterRes.remainingPoints,
      resetIn: Math.ceil(rateLimiterRes.msBeforeNext / 1000),
    };
  } catch (rateLimiterRes: any) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(rateLimiterRes.msBeforeNext / 1000),
    };
  }
}

// Get client IP from request
export function getClientIp(request: Request): string {
  // Try to get IP from various headers (for proxies, load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Rate limit response helper
export function rateLimitResponse(resetIn: number) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Rate limit exceeded',
      message: `You've reached the free tier limit of 5 requests per minute. Upgrade to Pro for unlimited access.`,
      resetIn,
      upgradeUrl: '/tools/netscan/pricing',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': resetIn.toString(),
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + resetIn * 1000).toString(),
      },
    }
  );
}

