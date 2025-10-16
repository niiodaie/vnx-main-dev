'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import ResultPanel from '@/components/netscan/ResultPanel';

const toolConfig: Record<
  string,
  { title: string; placeholder: string; param: string; description: string }
> = {
  'ip-lookup': {
    title: 'IP Lookup',
    placeholder: 'Enter IP address (e.g., 8.8.8.8)',
    param: 'ip',
    description:
      'Get detailed information about an IP address including location, ISP, and network details.',
  },
  geoip: {
    title: 'GeoIP Lookup',
    placeholder: 'Enter IP address (e.g., 1.1.1.1)',
    param: 'ip',
    description:
      'Discover geographic location, timezone, and network information for an IP address.',
  },
  whois: {
    title: 'WHOIS Lookup',
    placeholder: 'Enter domain (e.g., example.com)',
    param: 'domain',
    description:
      'Query domain registration information including registrar, dates, and nameservers.',
  },
  dns: {
    title: 'DNS Lookup',
    placeholder: 'Enter domain (e.g., google.com)',
    param: 'domain',
    description: 'Query DNS records (A, AAAA, MX, TXT, NS) for a domain name.',
  },
};

export default function ToolPage() {
  const params = useParams();
  const toolId = params.tool as string;
  const config = toolConfig[toolId];

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tool Not Found
          </h1>
          <Link
            href="/tools/netscan"
            className="text-blue-600 hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Netscan
          </Link>
        </div>
      </div>
    );
  }

  const handleScan = async () => {
    if (!input.trim()) {
      setError('Please enter a value');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/tools/netscan/${toolId}?${config.param}=${encodeURIComponent(
          input
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tools/netscan"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Netscan
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {config.title}
          </h1>
          <p className="text-lg text-blue-100">{config.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Input Section */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={config.placeholder}
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>

        {/* Results Section with new ResultPanel */}
        <ResultPanel 
          title={config.title} 
          data={result} 
          loading={loading} 
          error={error} 
        />

        {/* Info Section */}
        {!result && !loading && !error && (
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to use
            </h3>
            <p className="text-blue-700 text-sm">
              Enter a {config.param === 'ip' ? 'valid IP address' : 'domain name'}{' '}
              in the field above and click "Scan" to get detailed information.
              Results are cached for 10 minutes for faster subsequent queries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
