'use client';

import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, Zap } from 'lucide-react';
import { DashboardStats } from '@/types';

interface RealtimeStatsProps {
  data: DashboardStats | null;
}

export function RealtimeStats({ data }: RealtimeStatsProps) {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Activity className="h-5 w-5 text-green-600" />
            <div className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Live Stats</p>
            <p className="text-xs text-gray-500">Real-time updates</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              Today
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {data?.clicksToday || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center text-xs text-gray-500">
              <Zap className="h-3 w-3 mr-1" />
              Total
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {data?.totalClicks || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              URLs
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {data?.totalUrls || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
