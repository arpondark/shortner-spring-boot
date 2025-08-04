'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NetworkDebugPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const [tests, setTests] = useState<{ name: string, status: 'pending' | 'success' | 'error', message: string }[]>([
    { name: 'Environment Check', status: 'pending', message: 'Checking environment variables...' },
    { name: 'API Connection', status: 'pending', message: 'Testing direct API connection...' },
    { name: 'CORS Preflight', status: 'pending', message: 'Testing CORS preflight request...' },
    { name: 'POST Request', status: 'pending', message: 'Testing POST request...' },
    { name: 'Axios Client', status: 'pending', message: 'Testing Axios client...' },
  ]);
  const [logs, setLogs] = useState<string[]>([]);

  // Add log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // Update test status
  const updateTest = (index: number, status: 'pending' | 'success' | 'error', message: string) => {
    setTests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status, message };
      return updated;
    });
  };

  useEffect(() => {
    const runTests = async () => {
      try {
        // Test 1: Environment Check
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        setApiUrl(backendUrl);
        setOrigin(typeof window !== 'undefined' ? window.location.origin : 'SSR');
        
        if (!backendUrl) {
          updateTest(0, 'error', 'API URL not defined in environment variables');
        } else {
          updateTest(0, 'success', `API URL: ${backendUrl}`);
        }
        addLog(`Environment Check: API_URL=${backendUrl}, Origin=${typeof window !== 'undefined' ? window.location.origin : 'SSR'}`);
        
        // Test 2: Direct API Connection - Just check if the server is reachable
        try {
          const response = await fetch(`${backendUrl}`, { 
            method: 'HEAD',
            mode: 'no-cors' // This allows us to at least check if the server exists
          });
          updateTest(1, 'success', 'API server is reachable');
          addLog(`API Connection: Server is reachable`);
        } catch (error: any) {
          updateTest(1, 'error', `API server unreachable: ${error.message}`);
          addLog(`API Connection Error: ${error.message}`);
        }
        
        // Test 3: CORS Preflight
        try {
          const response = await fetch(`${backendUrl}/api/auth/public/register`, {
            method: 'OPTIONS',
            headers: {
              'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type',
            }
          });
          
          const corsHeader = response.headers.get('Access-Control-Allow-Origin');
          if (corsHeader) {
            updateTest(2, 'success', `CORS enabled: ${corsHeader}`);
            addLog(`CORS Preflight: Success - Allow-Origin: ${corsHeader}`);
          } else {
            updateTest(2, 'error', 'CORS headers missing');
            addLog(`CORS Preflight: Headers missing, status=${response.status}`);
          }
        } catch (error: any) {
          updateTest(2, 'error', `CORS preflight failed: ${error.message}`);
          addLog(`CORS Preflight Error: ${error.message}`);
        }
        
        // Test 4: POST Request
        try {
          const uniqueId = Date.now();
          const response = await fetch(`${backendUrl}/api/auth/public/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
            },
            body: JSON.stringify({
              username: `debug_${uniqueId}`,
              email: `debug_${uniqueId}@example.com`,
              password: 'debug123'
            })
          });
          
          if (response.ok) {
            const data = await response.text();
            updateTest(3, 'success', `POST request successful: ${data}`);
            addLog(`POST Request: Success - Response: ${data}`);
          } else {
            const errorText = await response.text();
            updateTest(3, 'error', `POST request failed: Status ${response.status}, ${errorText.substring(0, 100)}`);
            addLog(`POST Request: Failed - Status ${response.status}, ${errorText.substring(0, 100)}`);
          }
        } catch (error: any) {
          updateTest(3, 'error', `POST request error: ${error.message}`);
          addLog(`POST Request Error: ${error.message}`);
        }
        
        // Test 5: Axios Client
        try {
          const uniqueId = Date.now() + 1;
          const axiosInstance = axios.create({
            baseURL: backendUrl,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const response = await axiosInstance.post('/api/auth/public/register', {
            username: `axios_${uniqueId}`,
            email: `axios_${uniqueId}@example.com`,
            password: 'axios123'
          });
          
          updateTest(4, 'success', `Axios request successful: ${JSON.stringify(response.data)}`);
          addLog(`Axios Request: Success - Status ${response.status}, Data: ${JSON.stringify(response.data)}`);
        } catch (error: any) {
          updateTest(4, 'error', `Axios request error: ${error.message}`);
          addLog(`Axios Request Error: ${error.message}`);
          
          if (error.response) {
            addLog(`Axios Response Data: ${JSON.stringify(error.response.data)}`);
            addLog(`Axios Response Status: ${error.response.status}`);
            addLog(`Axios Response Headers: ${JSON.stringify(error.response.headers)}`);
          } else if (error.request) {
            addLog('Axios Error: No response received');
          }
        }
        
      } catch (error: any) {
        addLog(`General Error: ${error.message}`);
      }
    };

    runTests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Network Connectivity Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Environment</h2>
          <p><strong>API URL:</strong> {apiUrl}</p>
          <p><strong>Frontend Origin:</strong> {origin}</p>
        </div>
        
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          <ul className="space-y-2">
            {tests.map((test, index) => (
              <li key={index} className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  test.status === 'success' ? 'bg-green-500' : 
                  test.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <span className="font-medium mr-2">{test.name}:</span>
                <span className={test.status === 'error' ? 'text-red-500' : ''}>{test.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Debug Logs</h2>
        <div className="bg-gray-100 p-2 rounded max-h-60 overflow-y-auto">
          {logs.map((log, index) => (
            <pre key={index} className="text-xs whitespace-pre-wrap">{log}</pre>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Tests Again
        </button>
      </div>
    </div>
  );
}
