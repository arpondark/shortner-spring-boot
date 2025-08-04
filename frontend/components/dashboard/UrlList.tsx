'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Trash2, 
  BarChart3, 
  Clock,
  Check,
  RefreshCw,
  Search,
  QrCode
} from 'lucide-react';
import { UrlMapping } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { copyToClipboard, formatDate, getDomainFromUrl, getTimeAgo } from '@/utils';
import { QRCodeModal } from '@/components/ui/QRCodeModal';

interface UrlListProps {
  urls: UrlMapping[];
  loading: boolean;
  onUrlDeleted: (shortCode: string) => void;
  onRefresh: () => void;
}

export function UrlList({ urls, loading, onUrlDeleted, onRefresh }: UrlListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; url: string; shortCode: string }>({
    isOpen: false,
    url: '',
    shortCode: ''
  });

  const filteredUrls = urls.filter(url => {
    // Safety check to handle potentially undefined values
    const originalUrl = url?.originalUrl || '';
    const shortCode = url?.shortCode || '';
    const term = searchTerm.toLowerCase();
    
    return originalUrl.toString().toLowerCase().includes(term) || 
           shortCode.toString().toLowerCase().includes(term);
  });

  const handleCopy = async (shortCode: string) => {
    const url = `http://localhost:8080/${shortCode}`;
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedUrl(shortCode);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setDeletingUrl(shortCode);
    try {
      await apiClient.deleteUrl(shortCode);
      onUrlDeleted(shortCode);
      toast.success('URL deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete URL:', error);
      toast.error(error.response?.data?.message || 'Failed to delete URL');
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleVisit = (shortCode: string) => {
    window.open(`http://localhost:8080/${shortCode}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your URLs</h3>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your URLs</h3>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {filteredUrls.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <ExternalLink className="h-12 w-12" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No URLs found' : 'No URLs yet'}
          </h4>
          <p className="text-gray-600">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first short URL to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUrls.map((url) => (
            <div
              key={url.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        /{url.shortCode}
                      </code>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {url.clickCount} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {getDomainFromUrl(url.originalUrl)} • Created {getTimeAgo(url.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {url.originalUrl}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleVisit(url.shortCode)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Visit URL"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(url.shortCode)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === url.shortCode ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Analytics"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setQrModal({
                    isOpen: true,
                    url: `http://localhost:8080/${url.shortCode}`,
                    shortCode: url.shortCode
                  })}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(url.shortCode)}
                  disabled={deletingUrl === url.shortCode}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete URL"
                >
                  {deletingUrl === url.shortCode ? (
                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ isOpen: false, url: '', shortCode: '' })}
        url={qrModal.url}
        shortCode={qrModal.shortCode}
      />
    </div>
  );
}
