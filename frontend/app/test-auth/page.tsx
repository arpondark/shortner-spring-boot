'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log('Testing login with john_doe/password123...');
      const result = await apiClient.login('john_doe', 'password123');
      setResponse(result);
      toast.success('Login test successful!');
      console.log('Login response:', result);
    } catch (err: any) {
      setError(err);
      toast.error('Login test failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log('Testing registration...');
      const result = await apiClient.register('testuser', 'test@example.com', 'testpass123');
      setResponse(result);
      toast.success('Registration test successful!');
      console.log('Registration response:', result);
    } catch (err: any) {
      setError(err);
      toast.error('Registration test failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Login</h2>
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login (john_doe/password123)'}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Test Registration</h2>
            <button
              onClick={testRegister}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Registration'}
            </button>
          </div>

          {response && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Success Response:</h3>
              <pre className="bg-green-50 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Details:</h3>
              <pre className="bg-red-50 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify({
                  message: error.message,
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data,
                  code: error.code
                }, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">API Configuration:</h3>
            <pre className="bg-gray-50 p-4 rounded-md text-sm">
              API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
