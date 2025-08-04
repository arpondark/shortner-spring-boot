'use client';

import React, { useState, useEffect } from 'react';

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [corsStatus, setCorsStatus] = useState('Testing...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    // Test simple fetch
    try {
      const response = await fetch('http://localhost:8080/api/auth/public/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'john_doe',
          password: 'password123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiStatus('✅ API Connection Success');
        setCorsStatus('✅ CORS Working');
        console.log('Direct fetch success:', data);
      } else {
        setApiStatus(`❌ API Error: ${response.status} ${response.statusText}`);
        setCorsStatus('❌ CORS or API Issue');
      }
    } catch (error: any) {
      console.error('Connection test error:', error);
      setApiStatus(`❌ Connection Failed: ${error.message}`);
      if (error.message.includes('CORS')) {
        setCorsStatus('❌ CORS Blocked');
      } else {
        setCorsStatus('❌ Network Error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Connection Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">API Status:</h2>
            <p className="text-sm">{apiStatus}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">CORS Status:</h2>
            <p className="text-sm">{corsStatus}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Configuration:</h2>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify({
                'Frontend URL': typeof window !== 'undefined' ? window.location.origin : 'N/A',
                'API URL': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
                'User Agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
              }, null, 2)}
            </pre>
          </div>
          
          <button
            onClick={testConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Retest Connection
          </button>
        </div>
      </div>
    </div>
  );
}
