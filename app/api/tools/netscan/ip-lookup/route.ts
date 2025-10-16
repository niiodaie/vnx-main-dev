import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// LRU Cache with 10-minute TTL
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
});

// Optional API key security

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    // Validation
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    // Simple IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `ip-lookup:${ip}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }

    // Fetch from ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'VNX-Netscan/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch IP information');
    }

    const data = await response.json();

    // Structure the response
    const result = {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      country_code: data.country_code,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      isp: data.org,
      asn: data.asn,
      network: data.network,
      version: data.version,
    };

    // Cache the result
    cache.set(cacheKey, result);

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error: any) {
    console.error('IP Lookup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

