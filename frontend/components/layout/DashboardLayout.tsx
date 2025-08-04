'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Link, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, current: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, current: false },
  { name: 'My URLs', href: '/urls', icon: Link, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigationWithCurrent = navigation.map(item => ({
    ...item,
    current: pathname === item.href
  }));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center px-4">
            <Link className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">URL Shortener</span>
          </div>
          <nav className="mt-5 h-full flex-1 overflow-y-auto">
            <div className="space-y-1 px-2">
              {navigationWithCurrent.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <Link className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">URL Shortener</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationWithCurrent.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`${
                          item.current
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                        } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
