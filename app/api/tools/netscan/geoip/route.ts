 import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase'
import { hasToolAccess } from '@/config/tools'

// ✅ DEV/PREVIEW detection helper
const isDev =
  process.env.NODE_ENV === 'development' ||
  process.env.VERCEL_ENV === 'preview' ||
  process.env.NEXT_PUBLIC_ENV === 'dev'

// LRU Cache with 10-minute TTL
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 10,
})

export async function GET(request: NextRequest) {
  try {
    // ─────────────────────────────────────────────
    // 1️⃣  Get current user and plan
    // ─────────────────────────────────────────────
    const user = await getCurrentUser()
    const userTier = user ? await getUserTier(user.id) : 'free'
    const isPro = userTier === 'pro'

    // ─────────────────────────────────────────────
    // 2️⃣  Bypass subscription check in dev/preview
    // ─────────────────────────────────────────────
    if (!isDev && !hasToolAccess('geoip', userTier)) {
      return NextResponse.json(
        {
          error: 'Pro subscription required',
          message:
            'This tool requires a Pro subscription. Upgrade to access all tools.',
          upgradeUrl: '/tools/netscan/pricing',
        },
        { status: 403 }
      )
    }

    // ─────────────────────────────────────────────
    // 3️⃣  Rate Limiting
    // ─────────────────────────────────────────────
    const clientIp = getClientIp(request)
    const identifier = user?.id || clientIp
    const rateLimit = await checkRateLimit(identifier, isPro)

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn)
    }

    // ─────────────────────────────────────────────
    // 4️⃣  Validate query
    // ─────────────────────────────────────────────
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')

    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 })
    }

    // Optional IP regex validation
    const ipRegex =
      /^(\d{1,3}\.){3}\d{1,3}$|^(([a-fA-F0-9]{1,4}:){7,7}[a-fA-F0-9]{1,4}|([a-fA-F0-9]{1,4}:){1,7}:|([a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4})$/
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      )
    }

    // ─────────────────────────────────────────────
    // 5️⃣  Check Cache
    // ─────────────────────────────────────────────
    const cacheKey = `geoip:${ip}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetIn: rateLimit.resetIn,
        },
      })
    }

    // ─────────────────────────────────────────────
    // 6️⃣  Fetch data from ipapi.co
    // ─────────────────────────────────────────────
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'VNX-Netscan/1.0' },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch GeoIP information')
    }

    const data = await response.json()

    // ─────────────────────────────────────────────
    // 7️⃣  Normalize Response
    // ─────────────────────────────────────────────
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
    }

    cache.set(cacheKey, result)

    // ─────────────────────────────────────────────
    // 8️⃣  Send JSON response
    // ─────────────────────────────────────────────
    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetIn: rateLimit.resetIn,
      },
    })
  } catch (error: any) {
    console.error('GeoIP error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
