═══════════════════════════════════════════════════════════════════
  VNX-NETSCAN PHASE 1 - MVP DOCUMENTATION
═══════════════════════════════════════════════════════════════════

📋 OVERVIEW
───────────────────────────────────────────────────────────────────
VNX-Netscan is a professional network diagnostic and scanning tool
built with Next.js 15 + Turbopack. It provides serverless API routes
for IP lookup, GeoIP, WHOIS, and DNS queries with LRU caching and
optional Mapbox integration.

🚀 QUICK START
───────────────────────────────────────────────────────────────────

1. Install Dependencies:
   npm install

2. Configure Environment Variables (Optional):
   cp .env.example .env.local
   
   Edit .env.local:
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxx  # Optional: For map visualization
   NETSCAN_API_KEY=your-secret-key     # Optional: For API security

3. Run Development Server:
   npm run dev

4. Build for Production:
   npm run build

5. Start Production Server:
   npm start

📁 PROJECT STRUCTURE
───────────────────────────────────────────────────────────────────
app/
 ├─ api/
 │   └─ tools/
 │       └─ netscan/
 │            ├─ ip-lookup/route.ts     # IP address lookup
 │            ├─ geoip/route.ts         # Geographic IP info
 │            ├─ whois/route.ts         # Domain WHOIS
 │            ├─ dns/route.ts           # DNS records
 │            └─ meta/route.ts          # API metadata
 └─ tools/
     └─ netscan/
          ├─ page.tsx                   # Main landing page
          └─ [tool]/page.tsx            # Dynamic tool pages

components/
 └─ netscan/
      ├─ ResultViewer.tsx              # Results display + map
      └─ ToolCard.tsx                  # Tool cards

🔧 FEATURES
───────────────────────────────────────────────────────────────────

✅ IP Lookup
   - Get detailed IP information
   - Location, ISP, ASN, network details
   - Endpoint: /api/tools/netscan/ip-lookup?ip=8.8.8.8

✅ GeoIP
   - Geographic location data
   - Timezone, currency, languages
   - Endpoint: /api/tools/netscan/geoip?ip=1.1.1.1

✅ WHOIS
   - Domain registration info
   - Registrar, dates, nameservers
   - Endpoint: /api/tools/netscan/whois?domain=example.com

✅ DNS Lookup
   - Query DNS records (A, AAAA, MX, TXT, NS)
   - Complete DNS information
   - Endpoint: /api/tools/netscan/dns?domain=google.com

✅ LRU Caching
   - 10-minute TTL for all queries
   - Fast subsequent requests
   - Automatic cache management

✅ Mapbox Integration
   - Visual location maps for IP lookups
   - Graceful fallback if no token
   - Static map images

✅ Optional API Security
   - Bearer token authentication
   - Configurable via NETSCAN_API_KEY
   - Disabled by default

🌐 API USAGE
───────────────────────────────────────────────────────────────────

All API routes accept GET requests with query parameters:

1. IP Lookup:
   GET /api/tools/netscan/ip-lookup?ip=8.8.8.8

2. GeoIP:
   GET /api/tools/netscan/geoip?ip=1.1.1.1

3. WHOIS:
   GET /api/tools/netscan/whois?domain=example.com

4. DNS:
   GET /api/tools/netscan/dns?domain=google.com

5. Meta (API Info):
   GET /api/tools/netscan/meta

With API Key (if configured):
   Authorization: Bearer YOUR_API_KEY

🗺️ MAPBOX INTEGRATION
───────────────────────────────────────────────────────────────────

To enable map visualization:

1. Get a Mapbox token from https://mapbox.com
2. Add to .env.local:
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxx

3. Maps will automatically appear in IP/GeoIP results

Without token:
- Fallback message displayed
- All other features work normally

🔒 SECURITY
───────────────────────────────────────────────────────────────────

Optional API Key Protection:
1. Set NETSCAN_API_KEY in environment
2. Include in requests:
   Authorization: Bearer YOUR_KEY

Input Validation:
- IP address format validation
- Domain name format validation
- Sanitized query parameters

Rate Limiting:
- Implemented via LRU cache
- 100 entries max per endpoint
- 10-minute TTL

📊 CACHING STRATEGY
───────────────────────────────────────────────────────────────────

LRU Cache Configuration:
- Max entries: 100 per endpoint
- TTL: 600 seconds (10 minutes)
- Automatic eviction of old entries

Cache Keys:
- ip-lookup:{ip}
- geoip:{ip}
- whois:{domain}
- dns:{domain}

🚀 DEPLOYMENT TO VERCEL
───────────────────────────────────────────────────────────────────

1. Push to Git repository

2. Import to Vercel:
   - Framework: Next.js (auto-detected)
   - Build Command: npm run build
   - Output Directory: (leave empty)

3. Configure Environment Variables:
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxx  (optional)
   NETSCAN_API_KEY=your-secret-key     (optional)

4. Deploy!

Vercel Configuration:
- Serverless functions for all API routes
- Automatic edge caching
- Global CDN distribution

🧪 TESTING
───────────────────────────────────────────────────────────────────

Test API Endpoints:

1. IP Lookup:
   curl http://localhost:3000/api/tools/netscan/ip-lookup?ip=8.8.8.8

2. GeoIP:
   curl http://localhost:3000/api/tools/netscan/geoip?ip=1.1.1.1

3. WHOIS:
   curl http://localhost:3000/api/tools/netscan/whois?domain=example.com

4. DNS:
   curl http://localhost:3000/api/tools/netscan/dns?domain=google.com

5. Meta:
   curl http://localhost:3000/api/tools/netscan/meta

📦 DEPENDENCIES
───────────────────────────────────────────────────────────────────

Required:
- next@15.5.4
- react@19.1.0
- lru-cache@^11.0.2
- lucide-react (for icons)

Optional:
- whois-json (for WHOIS lookups)

🔧 TROUBLESHOOTING
───────────────────────────────────────────────────────────────────

Issue: API returns 401 Unauthorized
Fix: Check NETSCAN_API_KEY is set correctly or remove it

Issue: Maps not showing
Fix: Verify NEXT_PUBLIC_MAPBOX_TOKEN is set and valid

Issue: DNS lookup fails
Fix: Ensure Node.js dns module is available (serverless compatible)

Issue: WHOIS returns errors
Fix: Some domains may not have public WHOIS data

Issue: Build fails
Fix: Run `npm install` and ensure all dependencies are installed

📝 NOTES
───────────────────────────────────────────────────────────────────

- All API routes are serverless-compatible
- LRU cache is in-memory (per serverless instance)
- Mapbox token is public (NEXT_PUBLIC_*) but usage-limited
- API key should be kept secret (server-side only)
- Results are cached to reduce external API calls
- Graceful fallbacks for all external services

🎯 PHASE 2 ROADMAP
───────────────────────────────────────────────────────────────────

Coming Soon:
- Port scanning (requires backend service)
- Traceroute functionality
- SSL/TLS certificate checking
- Network speed testing
- Historical data tracking
- User accounts and saved scans

📄 LICENSE
───────────────────────────────────────────────────────────────────

See LICENSE_NETSCAN.txt for details.

Internal use only. Safe scanning practices apply.

═══════════════════════════════════════════════════════════════════
  VNX-Netscan Phase 1 - Built with Next.js 15 + Turbopack
  Part of the Visnec Nexus (VNX) Ecosystem
═══════════════════════════════════════════════════════════════════

