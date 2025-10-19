// app/api/tools/netscan/portscan/route.ts
import { NextRequest, NextResponse } from 'next/server';

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
      const mockPorts = (portsParam ? portsParam.split(',').map(s => Number(s.trim())||0) : DEFAULT_PORTS).filter(Boolean);
      return NextResponse.json({
        success: true,
        tool: 'portscan',
        host: rawHost || 'example.com',
        ports: mockPorts.map(p => ({
          port: p,
          proto: 'tcp',
          status: (p === 80 || p === 443) ? 'open' : 'closed',
          note: (p === 80 ? 'http' : p === 443 ? 'https' : null),
        })),
        timestamp: new Date().toISOString(),
        cached: false
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

    // Try dynamic import of Node 'net' (will fail in Edge)
    let nodeNet: any = null;
    try {
      nodeNet = await import('net').then(m => m);
    } catch (e) {
      nodeNet = null;
    }

    async function tcpConnect(host: string, port: number, timeout = CONNECT_TIMEOUT): Promise<'open'|'closed'|'filtered'> {
      if (!nodeNet) return 'filtered';
      return new Promise((resolve) => {
        try {
          const socket = nodeNet.createConnection({ host, port });
          let done = false;
          const cleanup = () => { try { socket.destroy(); } catch(_){} };
          const onOpen = () => { if (done) return; done = true; cleanup(); resolve('open'); };
          const onError = () => { if (done) return; done = true; cleanup(); resolve('closed'); };
          const onTimeout = () => { if (done) return; done = true; cleanup(); resolve('filtered'); };
          socket.setTimeout(timeout);
          socket.once('connect', onOpen);
          socket.once('error', onError);
          socket.once('timeout', onTimeout);
        } catch (err) {
          resolve('filtered');
        }
      });
    }

    // Fallback HTTP probe for 80/443 in Edge
    async function httpProbe(host: string, port: number, timeout = CONNECT_TIMEOUT): Promise<'open'|'closed'|'filtered'> {
      if (![80, 443].includes(port)) return 'filtered';
      const proto = port === 443 ? 'https' : 'http';
      const probeUrl = `${proto}://${host}:${port}/`;
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        let resp = await fetch(probeUrl, { method: 'HEAD', signal: controller.signal }).catch(() => null);
        if (!resp) resp = await fetch(probeUrl, { method: 'GET', signal: controller.signal }).catch(() => null);
        clearTimeout(id);
        if (resp) return 'open';
        return 'filtered';
      } catch (e) {
        return 'filtered';
      }
    }

    // Guess service by port for UI
    const serviceGuessMap: Record<number,string> = {
      22: 'ssh', 21:'ftp', 23:'telnet', 25:'smtp', 53:'dns',
      80:'http', 110:'pop3', 143:'imap', 443:'https',
      3306:'mysql', 3389:'rdp'
    };

    const scans = ports.map(async (port) => {
      let status: 'open'|'closed'|'filtered' = 'filtered';
      if (nodeNet) {
        status = await tcpConnect(rawHost, port, CONNECT_TIMEOUT);
      } else {
        status = await httpProbe(rawHost, port, CONNECT_TIMEOUT);
      }
      return {
        port,
        proto: 'tcp',
        status,
        note: serviceGuessMap[port] ?? null
      };
    });

    const results = await Promise.all(scans);

    return NextResponse.json({
      success: true,
      tool: 'portscan',
      host: rawHost,
      ports: results,
      timestamp: new Date().toISOString(),
      cached: false
    });
  } catch (err:any) {
    console.error('Portscan route error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
