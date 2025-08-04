'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UrlShortener } from '@/components/dashboard/UrlShortener';
import { UrlList } from '@/components/dashboard/UrlList';
import { apiClient } from '@/lib/api';
import { UrlMapping } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Link, Plus, RefreshCw } from 'lucide-react';

export default function UrlsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [urls, setUrls] = useState<UrlMapping[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUrls();
    }
  }, [isAuthenticated]);

  const loadUrls = async () => {
    try {
      setLoadingUrls(true);
      const response = await apiClient.getUserUrls(0, 100); // Load more URLs
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
    setShowCreateForm(false);
    toast.success('URL created successfully!');
  };

  const handleUrlDeleted = (shortCode: string) => {
    setUrls(prev => prev.filter(url => url.shortCode !== shortCode));
    toast.success('URL deleted successfully!');
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
            <h1 className="text-3xl font-bold text-gray-900">My URLs</h1>
            <p className="mt-2 text-gray-600">
              Manage all your shortened URLs in one place
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={loadUrls}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New URL
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total URLs</h3>
                <p className="text-2xl font-bold text-blue-600">{urls.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">∑</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Clicks</h3>
                <p className="text-2xl font-bold text-green-600">
                  {urls.reduce((sum, url) => sum + url.clickCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">⌀</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Avg. Clicks</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {urls.length > 0 ? Math.round(urls.reduce((sum, url) => sum + url.clickCount, 0) / urls.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create URL Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Create New Short URL</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            <UrlShortener onUrlCreated={handleUrlCreated} />
          </div>
        )}

        {/* URLs List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
          </div>
          <div className="p-6">
            <UrlList
              urls={urls}
              loading={loadingUrls}
              onUrlDeleted={handleUrlDeleted}
              onRefresh={loadUrls}
            />
          </div>
        </div>

        {/* Empty State */}
        {!loadingUrls && urls.length === 0 && (
          <div className="text-center py-12">
            <Link className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No URLs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first short URL.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First URL
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
