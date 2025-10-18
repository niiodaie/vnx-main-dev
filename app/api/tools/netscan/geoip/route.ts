import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { hasToolAccess } from '@/config/tools';

// LRU Cache with 10-minute TTL
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
});

export async function GET(request: NextRequest) {
  try {
    // Get user and tier
    const user = await getCurrentUser();
    const userTier = user ? await getUserTier(user.id) : 'free';
    const isPro = userTier === 'pro';

    // Check tool access
   // Bypass subscription check in dev or preview mode
const isDev =
  process.env.NODE_ENV === 'development' ||
  process.env.VERCEL_ENV === 'preview' ||
  process.env.NEXT_PUBLIC_ENV === 'dev'

if (!isDev && !hasToolAccess('geoip', userTier)) {
  return NextResponse.json(
    {
      error: 'Pro subscription required',
      message: 'This tool requires a Pro subscription. Upgrade to access all tools.',
      upgradeUrl: '/tools/netscan/pricing',
    },
    { status: 403 }
  )
}


    // Rate limiting
    const clientIp = getClientIp(request);
    const identifier = user?.id || clientIp;
    const rateLimit = await checkRateLimit(identifier, isPro);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn);
    }

    // Get IP parameter
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `geoip:${ip}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetIn: rateLimit.resetIn,
        },
      });
    }

    // Fetch from ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'VNX-Netscan/1.0' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GeoIP information');
    }

    const data = await response.json();

    const result = {
      success: true,
      tool: 'geoip',
      data: {
        ip: data.ip,
        location: {
          city: data.city,
          region: data.region,
          country: data.country_name,
          country_code: data.country_code,
          continent: data.continent_code,
          postal: data.postal,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        },
        timezone: {
          name: data.timezone,
          utc_offset: data.utc_offset,
        },
        network: {
          isp: data.org,
          asn: data.asn,
          network: data.network,
        },
        currency: data.currency,
        languages: data.languages,
      },
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);

    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetIn: rateLimit.resetIn,
      },
    });
  } catch (error: any) {
    console.error('GeoIP error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

