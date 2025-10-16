import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { promises as dns } from 'dns';

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

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    const cacheKey = `dns:${domain}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // Perform DNS lookups
    const [aRecords, aaaaRecords, mxRecords, txtRecords, nsRecords] =
      await Promise.allSettled([
        dns.resolve4(domain).catch(() => []),
        dns.resolve6(domain).catch(() => []),
        dns.resolveMx(domain).catch(() => []),
        dns.resolveTxt(domain).catch(() => []),
        dns.resolveNs(domain).catch(() => []),
      ]);

    const result = {
      domain: domain,
      records: {
        A: aRecords.status === 'fulfilled' ? aRecords.value : [],
        AAAA: aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : [],
        MX:
          mxRecords.status === 'fulfilled'
            ? mxRecords.value.map((mx) => ({
                exchange: mx.exchange,
                priority: mx.priority,
              }))
            : [],
        TXT:
          txtRecords.status === 'fulfilled'
            ? txtRecords.value.map((txt) => txt.join(' '))
            : [],
        NS: nsRecords.status === 'fulfilled' ? nsRecords.value : [],
      },
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);

    return NextResponse.json({ ...result, cached: false });
  } catch (error: any) {
    console.error('DNS error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

