// app/api/tools/netscan/geoip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { hasToolAccess } from '@/config/tools';

/**
 * GeoIP route
 *
 * - Accepts `ip` (IP or domain) and optional `mock=true`
 * - Returns standardized JSON:
 *   { success: boolean, tool: 'geoip', data: {...}, timestamp, cached, rateLimit: {...} }
 *
 * Notes:
 * - In development (`NODE_ENV !== 'production'`) this route bypasses the Pro-only gate
 * - Supports IPv4, IPv6, and domain resolution (via DNS or DoH)
 */

// Cache results for 10 minutes
const cache = new LRUCache<string, any>({
  max: 200,
  ttl: 1000 * 60 * 10,
});

const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
const IPV6_REGEX = /^[0-9a-fA-F:]{2,}$/;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const raw = (searchParams.get('ip') || '').trim();
    const useMocks = (searchParams.get('mock') || '').toLowerCase() === 'true';

    // 1️⃣ Mock for testing
    if (useMocks) {
      const mock = {
        success: true,
        tool: 'geoip',
        data: {
          ip: raw || '8.8.8.8',
          location: {
            city: 'Mountain View',
            region: 'California',
            country: 'United States',
            country_code: 'US',
            continent: 'NA',
            postal: '94043',
            coordinates: { latitude: 37.42301, longitude: -122.083352 },
          },
          timezone: { name: 'America/Los_Angeles', utc_offset: '-0700' },
          network: { isp: 'Google LLC', asn: 'AS15169', network: null },
          currency: 'USD',
          languages: 'en',
        },
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        ...mock,
        cached: false,
        rateLimit: { remaining: Infinity, resetIn: 0 },
      });
    }

    // 2️⃣ Validate input
    if (!raw) {
      return NextResponse.json({ error: 'IP address or domain is required' }, { status: 400 });
    }

    // 3️⃣ User + Tier
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const isProduction = process.env.NODE_ENV === 'production';

    // 4️⃣ Tier Access (Pro gate only in production)
    const safeTier: 'free' | 'pro' = userTier === 'pro' ? 'pro' : 'free';

    if (isProduction && !hasToolAccess('geoip', safeTier)) {
      return NextResponse.json(
        {
          error: 'Pro subscription required',
          message: 'This tool requires a Pro subscription. Upgrade to access all tools.',
          upgradeUrl: '/tools/netscan/pricing',
        },
        { status: 403 }
      );
    }

    // 5️⃣ Rate limiting
    const clientIp = getClientIp(request);
    const identifier = user?.id || clientIp || 'anon';
    const isPro = userTier === 'pro';
    const rateLimit = await checkRateLimit(identifier, isPro);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn);
    }

    // 6️⃣ Resolve domain if needed
    let ipToQuery = raw;
    if (!IPV4_REGEX.test(raw) && !IPV6_REGEX.test(raw)) {
      const resolved = await resolveDomainToIp(raw).catch((err) => {
        console.error('DNS resolution failed:', err);
        return null;
      });

      if (!resolved) {
        return NextResponse.json({ error: 'Failed to resolve domain to IP' }, { status: 400 });
      }

      ipToQuery = resolved;
    }

    if (!IPV4_REGEX.test(ipToQuery) && !IPV6_REGEX.test(ipToQuery)) {
      return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 });
    }

    // 7️⃣ Cache lookup
    const cacheKey = `geoip:${ipToQuery}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
      });
    }

    // 8️⃣ Fetch from provider
    const providerUrl = `https://ipapi.co/${encodeURIComponent(ipToQuery)}/json/`;
    const resp = await fetch(providerUrl, {
      headers: { 'User-Agent': 'VNX-Netscan/1.0' },
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`GeoIP provider error: ${resp.status} ${txt}`);
    }

    const data = await resp.json();

    // 9️⃣ Normalize data
    const result = {
      success: true,
      tool: 'geoip',
      data: {
        ip: data.ip ?? ipToQuery,
        location: {
          city: data.city ?? null,
          region: data.region ?? data.region_name ?? null,
          country: data.country_name ?? data.country ?? null,
          country_code: data.country_code ?? data.country_code_iso2 ?? null,
          continent: data.continent_code ?? null,
          postal: data.postal ?? null,
          coordinates: {
            latitude: parseNumberSafe(data.latitude) ?? parseNumberSafe(data.lat) ?? null,
            longitude: parseNumberSafe(data.longitude) ?? parseNumberSafe(data.lon) ?? null,
          },
        },
        timezone: { name: data.timezone ?? null, utc_offset: data.utc_offset ?? null },
        network: {
          isp: data.org ?? data.isp ?? null,
          asn: data.asn ?? null,
          network: data.network ?? null,
        },
        currency: data.currency ?? null,
        languages: data.languages ?? null,
      },
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);

    // 🔟 Return final response
    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
    });
  } catch (err: any) {
    console.error('GeoIP route error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

/** Utilities ****************************************************/

function parseNumberSafe(v: any): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Resolve domain name to IP (via Node DNS or Google DoH fallback) */
async function resolveDomainToIp(domain: string): Promise<string | null> {
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!/^[a-z0-9.-]+$/i.test(domain)) return null;

  try {
    const dnsPromises = await import('dns').then((d) => (d.promises ? d.promises : d));
    if (dnsPromises?.lookup) {
      const res = await dnsPromises.lookup(domain, { family: 4 }).catch(async () => {
        return dnsPromises.lookup(domain, { family: 6 }).catch(() => null);
      });
      if (res?.address) return res.address;
      if (Array.isArray(res) && res[0]?.address) return res[0].address;
    }
  } catch {
    // Fallback to DoH
  }

  try {
    const dohUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
    const dohResp = await fetch(dohUrl);
    if (!dohResp.ok) return null;
    const json = await dohResp.json();
    const aRecord = json.Answer?.find((a: any) => a.type === 1 && a.data);
    if (aRecord) return aRecord.data;

    const doh6 = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=AAAA`);
    if (doh6.ok) {
      const json6 = await doh6.json();
      const aaaa = json6.Answer?.find((a: any) => a.type === 28 && a.data);
      if (aaaa) return aaaa.data;
    }
  } catch (e) {
    console.warn('DoH lookup failed:', e);
  }

  return null;
}
