// app/api/tools/netscan/geoip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { hasToolAccess } from '@/config/tools';

/**
 * GeoIP route
 *
 * - Accepts `ip` (ip or domain) and optional `mock=true`
 * - Returns standardized JSON:
 *   { success: boolean, tool: 'geoip', data: {...}, timestamp, cached, rateLimit: {...} }
 *
 * Notes:
 * - In development (`NODE_ENV !== 'production'`) this route bypasses the pro-only gate
 *   so you can iterate without being blocked by subscription flags.
 * - Domain resolution tries node dns.promises first; if unavailable (Edge runtime)
 *   falls back to DNS-over-HTTPS (Google).
 */

// LRU cache for lookups (10 minutes)
const cache = new LRUCache<string, any>({
  max: 200,
  ttl: 1000 * 60 * 10,
});

// simple IPv4/IPv6 regexes
const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
const IPV6_REGEX = /^[0-9a-fA-F:]{2,}$/;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const raw = (searchParams.get('ip') || '').trim();
    const useMocks = (searchParams.get('mock') || '').toLowerCase() === 'true';

    // quick mock support for dev/demo
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

    // require ip parameter
    if (!raw) {
      return NextResponse.json({ error: 'IP address or domain is required' }, { status: 400 });
    }

    // auth / tier / access
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const isProduction = process.env.NODE_ENV === 'production';

    // ✅ In dev or preview mode, always allow full access
const isProduction = process.env.NODE_ENV === 'production';
const safeTier: 'free' | 'pro' = userTier === 'pro' ? 'pro' : 'free';

if (!isProduction) {
  console.log('[DEV MODE] GeoIP tool running with unrestricted access');
} else if (!hasToolAccess('geoip', safeTier)) {
  return NextResponse.json(
    {
      error: 'Pro subscription required',
      message: 'This tool requires a Pro subscription. Upgrade to access all tools.',
      upgradeUrl: '/tools/netscan/pricing',
    },
    { status: 403 }
  );
}

    // rate limiting (allow higher limits for pro)
    const clientIp = getClientIp(request);
    const identifier = user?.id || clientIp || 'anon';
    const isPro = userTier === 'pro';
    const rateLimit = await checkRateLimit(identifier, isPro);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn);
    }

    // resolve domain -> IP if necessary
    let ipToQuery = raw;
    if (!IPV4_REGEX.test(raw) && !IPV6_REGEX.test(raw)) {
      // assume domain name: attempt resolution
      const resolved = await resolveDomainToIp(raw).catch((err) => {
        console.error('DNS resolution failed:', err);
        return null;
      });

      if (!resolved) {
        return NextResponse.json({ error: 'Failed to resolve domain to IP' }, { status: 400 });
      }
      ipToQuery = resolved;
    }

    // final validation
    if (!IPV4_REGEX.test(ipToQuery) && !IPV6_REGEX.test(ipToQuery)) {
      return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 });
    }

    const cacheKey = `geoip:${ipToQuery}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
      });
    }

    // call provider (ipapi.co) - swap if you prefer another provider
    const providerUrl = `https://ipapi.co/${encodeURIComponent(ipToQuery)}/json/`;
    const resp = await fetch(providerUrl, {
      headers: { 'User-Agent': 'VNX-Netscan/1.0' },
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`GeoIP provider error: ${resp.status} ${txt}`);
    }

    const data = await resp.json();

    // normalize data shape (safe access)
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

/** Helpers ****************************************************/

/** safe number parse or null */
function parseNumberSafe(v: any): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Resolve domain to IP address.
 * Tries dns.promises.lookup first (Node), otherwise uses DNS-over-HTTPS fallback (Google).
 *
 * NOTE: We cast the dynamic import to `any` for the lookup call to avoid
 * TypeScript overload issues in environments where the Node `dns` types differ.
 */
async function resolveDomainToIp(domain: string): Promise<string | null> {
  // remove protocol if present
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // Basic validation for domain form:
  if (!/^[a-z0-9.-]+$/i.test(domain)) return null;

  // Try Node dns.promises if available
  try {
    // dynamic import so this does not throw in Edge runtimes that don't support dns.promises
    const dnsModule: any = await import('dns').then((d) => d.promises ?? d);
    if (dnsModule && typeof dnsModule.lookup === 'function') {
      // cast to any to avoid TypeScript complaints about overloads/options types
      const dnsAny: any = dnsModule;
      // try IPv4 first, fall back to IPv6
      const res4 = await dnsAny.lookup(domain, { family: 4 }).catch(async () => {
        return dnsAny.lookup(domain, { family: 6 }).catch(() => null);
      });
      if (res4) {
        // dns.lookup can return { address, family } or an array in some environments
        if (typeof res4.address === 'string') return res4.address;
        if (Array.isArray(res4) && res4[0] && res4[0].address) return res4[0].address;
      }
    }
  } catch (e) {
    // likely running in Edge / browser-like environment, fall through to DoH
    // console.debug('dns.promises not available; falling back to DoH', e);
  }

  // DNS-over-HTTPS fallback (Google DNS)
  try {
    const dohUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
    const dohResp = await fetch(dohUrl);
    if (!dohResp.ok) return null;
    const dohJson = await dohResp.json();
    if (dohJson?.Answer && Array.isArray(dohJson.Answer)) {
      // find first A record
      const aRecord = dohJson.Answer.find((a: any) => a.type === 1 && !!a.data);
      if (aRecord) return aRecord.data;
    }
    // try AAAA
    const doh6 = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=AAAA`);
    if (doh6.ok) {
      const j6 = await doh6.json();
      const aaaa = j6?.Answer && j6.Answer.find((a: any) => a.type === 28 && !!a.data);
      if (aaaa) return aaaa.data;
    }
  } catch (e) {
    console.warn('DoH lookup failed', e);
  }

  return null;
}
