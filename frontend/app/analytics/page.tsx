'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { apiClient } from '@/lib/api';
import { DashboardStats } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Globe, Monitor } from 'lucide-react';

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true);
      const stats = await apiClient.getDashboardStats();
      setDashboardData(stats);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoadingStats(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-gray-600">
              Detailed insights into your URL performance and user engagement
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards data={dashboardData} loading={loadingStats} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Growth Rate</h3>
                <p className="text-sm text-gray-500">Monthly increase</p>
                <p className="text-2xl font-bold text-green-600">+23.4%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Global Reach</h3>
                <p className="text-sm text-gray-500">Countries reached</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.clicksByCountry?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Monitor className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Avg. CTR</h3>
                <p className="text-sm text-gray-500">Click-through rate</p>
                <p className="text-2xl font-bold text-purple-600">4.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {dashboardData && (
          <div className="space-y-8">
            <AnalyticsCharts data={dashboardData} />
            
            {/* Additional Analytics Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing URLs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Top Performing URLs
                </h3>
                <div className="space-y-4">
                  {dashboardData.topUrls?.slice(0, 5).map((url, index) => (
                    <div key={url.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {url.originalUrl}
                        </p>
                        <p className="text-xs text-gray-500">
                          /{url.shortCode}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {url.clickCount} clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {dashboardData.recentClicks?.slice(0, 5).map((click, index) => (
                    <div key={click.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          /{click.urlMapping.shortCode}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(click.clickedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-xs text-gray-500">
                          {click.country || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingStats && (
          <div className="flex items-center justify-center py-12">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
