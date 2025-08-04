export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UrlMapping {
  id: number;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdAt: string;
  clickCount: number;
  user: User;
}

export interface ClickEvent {
  id: number;
  urlMapping: UrlMapping;
  clickedAt: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  country?: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  totalUsers: number;
  clicksToday: number;
  urlsToday: number;
  topUrls: UrlMapping[];
  recentClicks: ClickEvent[];
  clicksByDate: { date: string; clicks: number }[];
  clicksByCountry: { country: string; clicks: number }[];
  deviceStats: { device: string; count: number }[];
  browserStats: { browser: string; count: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
  urls: number;
}

export interface GeographicData {
  country: string;
  clicks: number;
  percentage: number;
}

export interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserData {
  browser: string;
  count: number;
  percentage: number;
}
