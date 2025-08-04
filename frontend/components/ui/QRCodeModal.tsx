'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, X } from 'lucide-react';
import QRCodeLib from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  shortCode: string;
}

export function QRCodeModal({ isOpen, onClose, url, shortCode }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const qrDataUrl = await QRCodeLib.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `qr-${shortCode}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <QrCode className="h-6 w-6 text-primary-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                QR Code for /{shortCode}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Scan this QR code to quickly access your shortened URL
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            {loading ? (
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${shortCode}`}
                  className="rounded-lg shadow-sm border border-gray-200"
                />
              )
            )}
          </div>
          
          <div className="mt-6 flex justify-between space-x-3">
            <button
              type="button"
              className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </button>
            {qrCodeDataUrl && (
              <button
                type="button"
                className="flex-1 inline-flex justify-center items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                onClick={downloadQRCode}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
