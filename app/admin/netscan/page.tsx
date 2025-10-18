'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  proUsers: number;
  totalRequests: number;
  totalRevenue: number;
  activeErrors: number;
}

interface Tool {
  id: string;
  name: string;
  enabled: boolean;
  requests: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    proUsers: 0,
    totalRequests: 0,
    totalRevenue: 0,
    activeErrors: 0,
  });
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/tools/netscan');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, toolsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/tools'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        setTools(toolsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleTool = async (toolId: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/admin/tools/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, enabled }),
      });

      if (res.ok) {
        setTools((prev) =>
          prev.map((tool) =>
            tool.id === toolId ? { ...tool, enabled } : tool
          )
        );
      }
    } catch (error) {
      console.error('Error toggling tool:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">VNX-Netscan Admin</h1>
          <p className="text-blue-100">
            Monitor usage, manage tools, and track payments
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Pro Users"
            value={stats.proUsers.toLocaleString()}
            color="green"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="API Requests"
            value={stats.totalRequests.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            color="emerald"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Active Errors"
            value={stats.activeErrors.toLocaleString()}
            color="red"
          />
        </div>

        {/* Tools Management */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Tool Management
              </h2>
            </div>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600">
                      {tool.requests.toLocaleString()} requests
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={(e) => toggleTool(tool.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">
                    {tool.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Activity logs will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

