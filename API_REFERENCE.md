# VNX-Netscan API Reference

## Overview

VNX-Netscan provides RESTful API endpoints for network diagnostic tools with built-in rate limiting and tier-based access control.

---

## Authentication

### Free Tier
- **No authentication required**
- **Rate Limit:** 5 requests per minute per IP
- **Access:** 5 basic tools only

### Pro Tier
- **Authentication:** Supabase JWT token
- **Rate Limit:** Unlimited
- **Access:** All 10 tools

---

## Rate Limiting

All API responses include rate limit headers:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1697654321000
```

When rate limit is exceeded:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "You've reached the free tier limit of 5 requests per minute. Upgrade to Pro for unlimited access.",
  "resetIn": 45,
  "upgradeUrl": "/tools/netscan/pricing"
}
```

---

## Response Format

All API endpoints return a unified response format:

### Success Response

```json
{
  "success": true,
  "tool": "geoip",
  "data": {
    // Tool-specific data
  },
  "timestamp": "2025-10-17T00:00:00Z",
  "cached": false,
  "rateLimit": {
    "remaining": 4,
    "resetIn": 60
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid IP address format",
  "tool": "geoip",
  "timestamp": "2025-10-17T00:00:00Z"
}
```

---

## Endpoints

### 1. IP Lookup

Get detailed information about an IP address.

**Endpoint:** `GET /api/tools/netscan/ip-lookup`

**Parameters:**
- `ip` (required) - IPv4 address to lookup

**Example Request:**
```bash
curl "https://visnec.ai/api/tools/netscan/ip-lookup?ip=8.8.8.8"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "ip-lookup",
  "data": {
    "ip": "8.8.8.8",
    "isp": "Google LLC",
    "asn": "AS15169",
    "country": "United States",
    "region": "California",
    "city": "Mountain View"
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Free

---

### 2. GeoIP Lookup

Get geolocation data with map coordinates.

**Endpoint:** `GET /api/tools/netscan/geoip`

**Parameters:**
- `ip` (required) - IPv4 address to geolocate

**Example Request:**
```bash
curl "https://visnec.ai/api/tools/netscan/geoip?ip=1.1.1.1"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "geoip",
  "data": {
    "ip": "1.1.1.1",
    "location": {
      "city": "Sydney",
      "region": "New South Wales",
      "country": "Australia",
      "country_code": "AU",
      "continent": "OC",
      "postal": "2000",
      "coordinates": {
        "latitude": -33.8688,
        "longitude": 151.2093
      }
    },
    "timezone": {
      "name": "Australia/Sydney",
      "utc_offset": "+11:00"
    },
    "network": {
      "isp": "Cloudflare, Inc.",
      "asn": "AS13335",
      "network": "1.1.1.0/24"
    }
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Free

---

### 3. WHOIS Lookup

Get domain registration information.

**Endpoint:** `GET /api/tools/netscan/whois`

**Parameters:**
- `domain` (required) - Domain name to lookup

**Example Request:**
```bash
curl "https://visnec.ai/api/tools/netscan/whois?domain=google.com"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "whois",
  "data": {
    "domain": "google.com",
    "registrar": "MarkMonitor Inc.",
    "created": "1997-09-15",
    "expires": "2028-09-14",
    "updated": "2019-09-09",
    "status": ["clientDeleteProhibited", "clientTransferProhibited"],
    "nameservers": ["ns1.google.com", "ns2.google.com"]
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Free

---

### 4. DNS Lookup

Query DNS records for a domain.

**Endpoint:** `GET /api/tools/netscan/dns`

**Parameters:**
- `domain` (required) - Domain name to query
- `type` (optional) - Record type (A, AAAA, MX, TXT, NS, CNAME). Default: ALL

**Example Request:**
```bash
curl "https://visnec.ai/api/tools/netscan/dns?domain=google.com&type=A"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "dns",
  "data": {
    "domain": "google.com",
    "records": {
      "A": ["142.250.185.46"],
      "AAAA": ["2607:f8b0:4004:c07::71"],
      "MX": [
        "10 smtp.google.com"
      ],
      "TXT": [
        "v=spf1 include:_spf.google.com ~all"
      ],
      "NS": [
        "ns1.google.com",
        "ns2.google.com"
      ]
    }
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Free

---

### 5. Ping

Test network latency and connectivity.

**Endpoint:** `GET /api/tools/netscan/ping`

**Parameters:**
- `host` (required) - Hostname or IP to ping
- `count` (optional) - Number of pings (1-10). Default: 4

**Example Request:**
```bash
curl "https://visnec.ai/api/tools/netscan/ping?host=google.com&count=4"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "ping",
  "data": {
    "host": "google.com",
    "ip": "142.250.185.46",
    "packets": {
      "sent": 4,
      "received": 4,
      "lost": 0,
      "loss_percent": 0
    },
    "latency": {
      "min": 12.3,
      "avg": 15.7,
      "max": 19.2,
      "stddev": 2.8
    },
    "results": [
      { "seq": 1, "time": 14.2, "ttl": 56 },
      { "seq": 2, "time": 15.1, "ttl": 56 },
      { "seq": 3, "time": 19.2, "ttl": 56 },
      { "seq": 4, "time": 14.3, "ttl": 56 }
    ]
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Free

---

### 6. Traceroute (Pro)

Trace network path to a host.

**Endpoint:** `GET /api/tools/netscan/traceroute`

**Parameters:**
- `host` (required) - Hostname or IP to trace

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/traceroute?host=google.com"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "traceroute",
  "data": {
    "host": "google.com",
    "destination_ip": "142.250.185.46",
    "hops": [
      {
        "hop": 1,
        "ip": "192.168.1.1",
        "hostname": "router.local",
        "rtt": [2.1, 2.3, 2.2]
      },
      {
        "hop": 2,
        "ip": "10.0.0.1",
        "hostname": "isp-gateway",
        "rtt": [12.5, 13.1, 12.8]
      }
    ],
    "total_hops": 12
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Pro

---

### 7. Speed Test (Pro)

Test network bandwidth and latency.

**Endpoint:** `GET /api/tools/netscan/speed`

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/speed"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "speed",
  "data": {
    "download": {
      "bandwidth": 95.3,
      "unit": "Mbps"
    },
    "upload": {
      "bandwidth": 45.7,
      "unit": "Mbps"
    },
    "ping": {
      "latency": 12.4,
      "jitter": 1.2,
      "unit": "ms"
    },
    "server": {
      "host": "speedtest.net",
      "location": "New York, US"
    }
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Pro

---

### 8. Port Scanner (Pro)

Scan TCP ports on a host.

**Endpoint:** `GET /api/tools/netscan/port-scanner`

**Parameters:**
- `host` (required) - Hostname or IP to scan
- `ports` (optional) - Comma-separated ports or range (e.g., "80,443" or "1-1000"). Default: common ports

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/port-scanner?host=example.com&ports=80,443,8080"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "port-scanner",
  "data": {
    "host": "example.com",
    "ip": "93.184.216.34",
    "ports": [
      {
        "port": 80,
        "state": "open",
        "service": "http"
      },
      {
        "port": 443,
        "state": "open",
        "service": "https"
      },
      {
        "port": 8080,
        "state": "closed",
        "service": "http-proxy"
      }
    ],
    "scan_time": 2.3
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Pro

---

### 9. SSL/TLS Check (Pro)

Validate SSL/TLS certificate.

**Endpoint:** `GET /api/tools/netscan/ssl-check`

**Parameters:**
- `domain` (required) - Domain to check

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/ssl-check?domain=google.com"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "ssl-check",
  "data": {
    "domain": "google.com",
    "valid": true,
    "certificate": {
      "issuer": "GTS CA 1C3",
      "subject": "*.google.com",
      "valid_from": "2025-01-01T00:00:00Z",
      "valid_to": "2025-12-31T23:59:59Z",
      "days_remaining": 245,
      "serial_number": "0x1234567890abcdef",
      "signature_algorithm": "SHA256-RSA"
    },
    "chain": [
      {
        "subject": "*.google.com",
        "issuer": "GTS CA 1C3"
      },
      {
        "subject": "GTS CA 1C3",
        "issuer": "GTS Root R1"
      }
    ]
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Pro

---

### 10. Wireshark Light (Pro)

Basic packet capture and analysis.

**Endpoint:** `GET /api/tools/netscan/wireshark-light`

**Parameters:**
- `duration` (optional) - Capture duration in seconds (1-60). Default: 10
- `filter` (optional) - BPF filter expression

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/wireshark-light?duration=10&filter=tcp port 80"
```

**Example Response:**
```json
{
  "success": true,
  "tool": "wireshark-light",
  "data": {
    "duration": 10,
    "filter": "tcp port 80",
    "packets": {
      "total": 1247,
      "tcp": 892,
      "udp": 245,
      "icmp": 110
    },
    "protocols": {
      "HTTP": 456,
      "HTTPS": 436,
      "DNS": 245,
      "Other": 110
    },
    "top_sources": [
      { "ip": "192.168.1.100", "packets": 523 },
      { "ip": "192.168.1.101", "packets": 312 }
    ]
  },
  "timestamp": "2025-10-17T00:00:00Z"
}
```

**Tier:** Pro

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Missing or invalid parameters |
| 403 | Forbidden | Pro subscription required |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Caching

All API responses are cached for **10 minutes** using LRU cache. Cached responses include `"cached": true` in the response.

---

## Best Practices

1. **Handle Rate Limits:** Check `X-RateLimit-Remaining` header and implement exponential backoff
2. **Cache Responses:** Cache responses on your end to reduce API calls
3. **Use Appropriate Timeouts:** Set reasonable timeouts (30-60 seconds) for network operations
4. **Handle Errors Gracefully:** Always check `success` field and handle errors appropriately
5. **Upgrade to Pro:** For production use, upgrade to Pro tier for unlimited access

---

## SDK Examples

### JavaScript/TypeScript

```typescript
async function lookupIP(ip: string) {
  const response = await fetch(
    `https://visnec.ai/api/tools/netscan/ip-lookup?ip=${ip}`
  );
  
  if (!response.ok) {
    if (response.status === 429) {
      const data = await response.json();
      console.log(`Rate limited. Retry in ${data.resetIn} seconds`);
      return;
    }
    throw new Error('API request failed');
  }
  
  const data = await response.json();
  return data.data;
}
```

### Python

```python
import requests

def lookup_ip(ip):
    response = requests.get(
        f'https://visnec.ai/api/tools/netscan/ip-lookup',
        params={'ip': ip}
    )
    
    if response.status_code == 429:
        data = response.json()
        print(f"Rate limited. Retry in {data['resetIn']} seconds")
        return None
    
    response.raise_for_status()
    return response.json()['data']
```

### cURL

```bash
# Basic request
curl "https://visnec.ai/api/tools/netscan/ip-lookup?ip=8.8.8.8"

# With authentication (Pro)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "https://visnec.ai/api/tools/netscan/traceroute?host=google.com"

# With rate limit handling
curl -i "https://visnec.ai/api/tools/netscan/geoip?ip=1.1.1.1" | \
  grep -E "(X-RateLimit|HTTP)"
```

---

## Support

For API support:
- **Documentation:** https://visnec.ai/docs/api
- **Status Page:** https://status.visnec.ai
- **Contact:** support@visnec.ai

---

**API Version:** 1.0  
**Last Updated:** October 17, 2025  
**Base URL:** https://visnec.ai/api/tools/netscan

