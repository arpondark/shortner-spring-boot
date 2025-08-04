'use client';

import React from 'react';
import { 
  Link, 
  MousePointer, 
  Users, 
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatNumber } from '@/utils';

interface StatsCardsProps {
  data: DashboardStats | null;
  loading: boolean;
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  const stats = [
    {
      name: 'Total URLs',
      value: data?.totalUrls || 0,
      icon: Link,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Clicks',
      value: data?.totalClicks || 0,
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'increase' as const,
    },
    {
      name: 'Active Users',
      value: data?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+3%',
      changeType: 'increase' as const,
    },
    {
      name: 'Clicks Today',
      value: data?.clicksToday || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+24%',
      changeType: 'increase' as const,
    },
    {
      name: 'URLs Today',
      value: data?.urlsToday || 0,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+5%',
      changeType: 'increase' as const,
    },
    {
      name: 'Avg. Click Rate',
      value: data?.totalUrls ? Math.round((data.totalClicks / data.totalUrls) * 100) / 100 : 0,
      icon: Clock,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      change: '+15%',
      changeType: 'increase' as const,
      suffix: ' clicks/URL',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="stat-card animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div key={stat.name} className="stat-card group hover:scale-105 transform transition-all duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${stat.bgColor} p-3 rounded-lg group-hover:shadow-md transition-shadow`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatNumber(stat.value)}
                    {stat.suffix && (
                      <span className="text-sm font-normal text-gray-500">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={`${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              } flex items-center font-medium`}>
                {stat.changeType === 'increase' ? '+' : '-'}
                <TrendingUp className="w-3 h-3 ml-1" />
                {stat.change}
              </span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
