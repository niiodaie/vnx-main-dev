// app/api/tools/netscan/portscan/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Port scanner route
 *
 * Query parameters:
 *  - host (required) : domain or IP
 *  - ports (optional) : comma separated list e.g. 22,80,443  (defaults to "22,80,443,3389")
 *  - mock (optional)  : "true" to return mocked data for dev/demo
 *
 * Behavior:
 *  - If Node `net` is available, attempts real TCP connects to each port (fast timeout).
 *  - If `net` is not available (Edge runtime), falls back to HTTP probing for ports 80/443:
 *      - tries HEAD/GET on http://host:port/ or https://host:port/
 *  - Returns JSON:
 *    {
 *      success: true,
 *      tool: 'portscan',
 *      host: 'example.com',
 *      ports: [{ port: 80, status: 'open'|'closed'|'filtered', proto: 'tcp', note: 'http service' }],
 *      timestamp, cached: false
 *    }
 */

const DEFAULT_PORTS = [22, 80, 443, 3389];
const CONNECT_TIMEOUT = 1500; // ms per port

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const rawHost = (searchParams.get('host') || '').trim();
    const portsParam = (searchParams.get('ports') || '').trim();
    const useMocks = (searchParams.get('mock') || '').toLowerCase() === 'true';

    if (useMocks) {
      // Demo mock response
      const mockPorts = (portsParam ? portsParam.split(',').map(s => Number(s.trim()) || 0) : DEFAULT_PORTS).filter(Boolean);
      return NextResponse.json({
        success: true,
        tool: 'portscan',
        host: rawHost || '8.8.8.8',
        ports: mockPorts.map(p => ({
          port: p,
          status: p === 80 || p === 443 ? 'open' : 'closed',
          proto: 'tcp',
          note: p === 80 ? 'http' : p === 443 ? 'https' : null,
        })),
        timestamp: new Date().toISOString(),
        cached: false,
      });
    }

    if (!rawHost) {
      return NextResponse.json({ error: 'host query parameter is required (domain or IP)' }, { status: 400 });
    }

    // parse ports
    let ports: number[] = [];
    if (portsParam) {
      ports = portsParam.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => Number.isInteger(n) && n > 0 && n < 65536);
      if (ports.length === 0) {
        return NextResponse.json({ error: 'ports parameter invalid. Provide comma-separated port numbers.' }, { status: 400 });
      }
    } else {
      ports = DEFAULT_PORTS.slice();
    }

    // Try to use Node net for TCP connect; dynamic import so Edge runtime won't break build
    let nodeNet: any = null;
    try {
      // dynamic import; cast to any to avoid type issues across environments
      // (this will throw in Edge runtimes where 'net' is not available)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      nodeNet = await import('net').then((m) => m);
    } catch (e) {
      nodeNet = null;
    }

    // Scanner helpers
    async function tcpConnect(host: string, port: number, timeout = CONNECT_TIMEOUT): Promise<'open' | 'closed' | 'filtered'> {
      if (!nodeNet) return 'filtered'; // fallback indicator
      return new Promise((resolve) => {
        try {
          const socket = nodeNet.createConnection({ host, port });
          let done = false;
          const onOpen = () => {
            if (done) return;
            done = true;
            socket.destroy();
            resolve('open');
          };
          const onError = () => {
            if (done) return;
            done = true;
            socket.destroy();
            resolve('closed');
          };
          const onTimeout = () => {
            if (done) return;
            done = true;
            socket.destroy();
            resolve('filtered');
          };
          socket.setTimeout(timeout);
          socket.once('connect', onOpen);
          socket.once('error', onError);
          socket.once('timeout', onTimeout);
        } catch (err) {
          resolve('filtered');
        }
      });
    }

    // Fallback HTTP probe for common HTTP ports when net not available (Edge)
    async function httpProbe(host: string, port: number, timeout = CONNECT_TIMEOUT): Promise<'open' | 'closed' | 'filtered'> {
      // only attempt for port 80/443 or other likely HTTP ports
      if (![80, 443].includes(port)) return 'filtered';
      const proto = port === 443 ? 'https' : 'http';
      const probeUrl = `${proto}://${host}:${port}/`;
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        // Try HEAD first for lighter-weight probe, fall back to GET
        let resp = await fetch(probeUrl, { method: 'HEAD', signal: controller.signal }).catch(() => null);
        if (!resp) {
          resp = await fetch(probeUrl, { method: 'GET', signal: controller.signal }).catch(() => null);
        }
        clearTimeout(id);
        if (resp && resp.ok) return 'open';
        if (resp) {
          // got response but non-2xx -> consider open (service present)
          return 'open';
        }
        return 'filtered';
      } catch (e) {
        return 'filtered';
      }
    }

    // perform scans (in parallel but bounded)
    const scans = ports.map(async (port) => {
      let status: 'open' | 'closed' | 'filtered' = 'filtered';
      let note: string | null = null;

      // prefer raw TCP if available
      if (nodeNet) {
        status = await tcpConnect(rawHost, port, CONNECT_TIMEOUT);
      } else {
        // fallback: if HTTP ports, try HTTP probe
        status = await httpProbe(rawHost, port, CONNECT_TIMEOUT);
      }

      // best-effort service guessing for UI
      const serviceGuessMap: Record<number, string> = {
        22: 'ssh',
        21: 'ftp',
        23: 'telnet',
        25: 'smtp',
        53: 'dns',
        80: 'http',
        110: 'pop3',
        143: 'imap',
        443: 'https',
        3306: 'mysql',
        3389: 'rdp',
      };
      if (serviceGuessMap[port]) note = serviceGuessMap[port];

      return { port, proto: 'tcp', status, note };
    });

    const results = await Promise.all(scans);

    return NextResponse.json({
      success: true,
      tool: 'portscan',
      host: rawHost,
      ports: results,
      timestamp: new Date().toISOString(),
      cached: false,
    });
  } catch (err: any) {
    console.error('Portscan route error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
