'use client';

import React, { useState } from 'react';
import { Link, Copy, QrCode, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { UrlMapping } from '@/types';
import { toast } from 'react-hot-toast';
import { copyToClipboard, isValidUrl } from '@/utils';

interface UrlShortenerProps {
  onUrlCreated: (url: UrlMapping) => void;
}

export function UrlShortener({ onUrlCreated }: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCreatedUrl, setLastCreatedUrl] = useState<UrlMapping | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const newUrl = await apiClient.createShortUrl(originalUrl);
      setLastCreatedUrl(newUrl);
      onUrlCreated(newUrl);
      setOriginalUrl('');
      toast.success('Short URL created successfully!');
    } catch (error: any) {
      console.error('Failed to create short URL:', error);
      toast.error(error.response?.data?.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const generateQR = () => {
    if (lastCreatedUrl) {
      // This would open a QR code generator modal
      toast.info('QR Code generation coming soon!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-lg">
          <Link className="w-6 h-6 text-primary-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Short URL</h2>
          <p className="text-gray-600">Transform your long URLs into short, shareable links</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Original URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              id="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !originalUrl.trim()}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Shorten'
              )}
            </button>
          </div>
        </div>
      </form>

      {lastCreatedUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium mb-1">
                Your short URL is ready!
              </p>
              <div className="flex items-center space-x-2">
                <code className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm font-mono">
                  {`http://localhost:8080/${lastCreatedUrl.shortCode}`}
                </code>
                <button
                  onClick={() => handleCopy(`http://localhost:8080/${lastCreatedUrl.shortCode}`)}
                  className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={generateQR}
                  className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Code
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-600">
            <span className="font-medium">Original:</span> {lastCreatedUrl.originalUrl}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">Fast</div>
          <div className="text-sm text-gray-600">Instant URL shortening</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">Secure</div>
          <div className="text-sm text-gray-600">Protected with JWT auth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">Analytics</div>
          <div className="text-sm text-gray-600">Detailed click tracking</div>
        </div>
      </div>
    </div>
  );
}
