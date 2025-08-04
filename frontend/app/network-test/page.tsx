'use client';

import { useState } from 'react';

export default function NetworkTestPage() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectFetch = async () => {
    addResult('🧪 Starting direct fetch test...');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/public/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `test_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      
      const data = await response.text();
      addResult(`✅ Direct fetch success: ${response.status} - ${data}`);
    } catch (error: any) {
      addResult(`❌ Direct fetch failed: ${error.message}`);
    }
  };

  const testApiClient = async () => {
    addResult('🧪 Starting API client test...');
    
    try {
      // Import the API client dynamically
      const { apiClient } = await import('../../lib/api');
      const result = await apiClient.register(
        `test_api_${Date.now()}`,
        `test_api_${Date.now()}@example.com`,
        'password123'
      );
      addResult(`✅ API client success: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ API client failed: ${error.message}`);
      if (error.response) {
        addResult(`❌ Response status: ${error.response.status}`);
        addResult(`❌ Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const testCorsOptions = async () => {
    addResult('🧪 Starting CORS OPTIONS test...');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/public/register', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      addResult(`✅ CORS preflight: ${response.status}`);
      addResult(`✅ CORS headers: ${response.headers.get('Access-Control-Allow-Origin')}`);
    } catch (error: any) {
      addResult(`❌ CORS preflight failed: ${error.message}`);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Network Connection Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testCorsOptions}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test CORS Options
        </button>
        
        <button 
          onClick={testDirectFetch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Direct Fetch
        </button>
        
        <button 
          onClick={testApiClient}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test API Client
        </button>
        
        <button 
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a button above to start testing.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="font-mono text-sm p-2 bg-white rounded">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Info:</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</li>
          <li><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</li>
          <li><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) + '...' : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
}
