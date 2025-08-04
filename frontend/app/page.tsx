'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UrlShortener } from '@/components/dashboard/UrlShortener';
import { UrlList } from '@/components/dashboard/UrlList';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { RealtimeStats } from '@/components/dashboard/RealtimeStats';
import { apiClient } from '@/lib/api';
import { DashboardStats, UrlMapping } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [urls, setUrls] = useState<UrlMapping[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUrls, setLoadingUrls] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
      loadUrls();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true);
      const stats = await apiClient.getDashboardStats();
      setDashboardData(stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUrls = async () => {
    try {
      setLoadingUrls(true);
      const response = await apiClient.getUserUrls();
      setUrls(response.content || []);
    } catch (error) {
      console.error('Failed to load URLs:', error);
      toast.error('Failed to load your URLs');
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleUrlCreated = (newUrl: UrlMapping) => {
    setUrls(prev => [newUrl, ...prev]);
    loadDashboardData(); // Refresh stats
  };

  const handleUrlDeleted = (shortCode: string) => {
    setUrls(prev => prev.filter(url => url.shortCode !== shortCode));
    loadDashboardData(); // Refresh stats
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor your URL shortening performance and analytics
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <RealtimeStats data={dashboardData} />
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards data={dashboardData} loading={loadingStats} />

        {/* URL Shortener */}
        <UrlShortener onUrlCreated={handleUrlCreated} />

        {/* Analytics Charts */}
        {dashboardData && (
          <AnalyticsCharts data={dashboardData} />
        )}

        {/* URL List */}
        <UrlList
          urls={urls}
          loading={loadingUrls}
          onUrlDeleted={handleUrlDeleted}
          onRefresh={loadUrls}
        />
      </div>
    </DashboardLayout>
  );
}
