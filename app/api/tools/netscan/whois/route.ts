import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// LRU Cache with 10-minute TTL
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
});

const API_KEY = process.env.NETSCAN_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (API_KEY) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${API_KEY}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Simple domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    const cacheKey = `whois:${domain}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // Use a public WHOIS API (whoisjson.com)
    const response = await fetch(
      `https://whoisjson.com/api/v1/whois?domain=${domain}`,
      {
        headers: { 'User-Agent': 'VNX-Netscan/1.0' },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch WHOIS information');
    }

    const data = await response.json();

    const result = {
      domain: domain,
      registrar: data.registrar?.name || 'N/A',
      created_date: data.created_date || 'N/A',
      updated_date: data.updated_date || 'N/A',
      expires_date: data.expires_date || 'N/A',
      status: data.status || [],
      nameservers: data.nameservers || [],
      dnssec: data.dnssec || 'N/A',
      raw_data: data.raw_text || '',
    };

    cache.set(cacheKey, result);

    return NextResponse.json({ ...result, cached: false });
  } catch (error: any) {
    console.error('WHOIS error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

