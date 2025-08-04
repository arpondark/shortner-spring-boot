# URL Shortener Frontend

A modern, responsive Next.js frontend for the URL Shortener application with comprehensive analytics and real-time visualizations.

## Features

### 🎯 Core Features
- **JWT Authentication** - Secure login/register with token-based auth
- **URL Shortening** - Create short URLs with custom codes
- **Real-time Analytics** - Live stats and performance monitoring
- **Responsive Design** - Mobile-first design with Tailwind CSS

### 📊 Analytics & Visualizations
- **Interactive Charts** - Line, bar, pie, and area charts using Recharts
- **Geographic Analytics** - Click tracking by country/region
- **Device Analytics** - Browser and device usage statistics
- **Time-series Data** - Performance trends over time
- **Top URLs** - Most clicked URLs ranking

### 🎨 Modern UI Components
- **Beautiful Dashboard** - Clean, professional interface
- **Loading States** - Smooth loading animations
- **Toast Notifications** - User-friendly feedback system
- **Responsive Tables** - Mobile-optimized data display
- **Search & Filters** - Advanced URL management

## Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Notification system

### Charts & Visualizations
- **Recharts** - Chart library for React
- **Lucide React** - Modern icon library
- **Custom Animations** - CSS transitions and transforms

### State Management & API
- **React Context** - Authentication state management
- **Axios** - HTTP client with interceptors
- **JS Cookie** - Client-side cookie management

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles & Tailwind
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Dashboard page
│   └── login/
│       └── page.tsx             # Login page
├── components/                   # Reusable UI components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── AnalyticsCharts.tsx  # Chart visualizations
│   │   ├── RealtimeStats.tsx    # Live statistics
│   │   ├── StatsCards.tsx       # Metric cards
│   │   ├── UrlList.tsx          # URL management table
│   │   └── UrlShortener.tsx     # URL creation form
│   ├── layout/                  # Layout components
│   │   └── DashboardLayout.tsx  # Main dashboard layout
│   └── providers/               # Context providers
│       └── AuthProvider.tsx     # Authentication context
├── lib/                         # Utility libraries
│   └── api.ts                   # API client & endpoints
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Shared interfaces
├── utils/                       # Helper functions
│   └── index.ts                 # Common utilities
├── package.json                 # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend URL Shortener service running on port 8080

### Quick Start

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### API Integration
The frontend connects to your Spring Boot backend:
- Authentication endpoints: `/api/auth/public/*`
- URL management: `/api/url/*`
- Analytics: `/api/url/*/analytics`

## Component Guide

### Dashboard Components

#### StatsCards
Displays key metrics with icons and trend indicators:
- Total URLs, clicks, users
- Today's statistics
- Performance indicators

#### AnalyticsCharts
Comprehensive chart visualizations:
- **Line Charts** - Performance over time
- **Pie Charts** - Geographic distribution
- **Bar Charts** - Device/browser statistics
- **Area Charts** - Trend analysis

#### UrlShortener
URL creation interface:
- URL validation
- Copy to clipboard
- QR code generation (planned)
- Success feedback

#### UrlList
URL management with features:
- Search and filtering
- Copy, delete, analytics actions
- Click statistics
- Responsive design

#### RealtimeStats
Live statistics widget:
- Real-time click tracking
- Performance indicators
- Status indicators

### Layout Components

#### DashboardLayout
Main application layout:
- Responsive sidebar navigation
- User profile section
- Mobile-friendly design
- Authentication handling

#### AuthProvider
Authentication context:
- JWT token management
- User state management
- API authentication
- Route protection

## API Integration

### Authentication Flow
```typescript
// Login
const response = await apiClient.login(username, password);
await login(response.token);

// Automatic token injection
axios.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### URL Management
```typescript
// Create short URL
const newUrl = await apiClient.createShortUrl(originalUrl);

// Get user URLs
const urls = await apiClient.getUserUrls(page, size);

// Delete URL
await apiClient.deleteUrl(shortCode);
```

### Analytics Data
```typescript
// Get dashboard statistics
const stats = await apiClient.getDashboardStats();

// Get URL-specific analytics
const analytics = await apiClient.getUrlAnalytics(shortCode);
```

## Styling & Theming

### Tailwind Configuration
Custom color palette and utilities:
```javascript
// Primary colors
primary: {
  50: '#eff6ff',
  500: '#3b82f6',
  600: '#2563eb',
  // ...
}

// Custom animations
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
}
```

### Component Classes
```css
.card - White card with shadow
.btn-primary - Primary action button
.btn-secondary - Secondary button
.input-field - Styled form input
.stat-card - Metric display card
```

## Performance Optimizations

### Code Splitting
- Automatic Next.js code splitting
- Dynamic imports for heavy components
- Lazy loading for charts

### Image & Asset Optimization
- Next.js Image optimization
- Icon optimization with Lucide React
- CSS optimization with Tailwind

### API Optimization
- Request caching
- Error handling with retry logic
- Loading states for better UX

## Development Features

### TypeScript Integration
- Strict type checking
- API response typing
- Component prop validation
- Enum definitions

### Development Tools
- Hot reload with Next.js
- ESLint configuration
- Prettier formatting
- TypeScript compilation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Code Style Guidelines
- Use TypeScript for all new code
- Follow React functional component patterns
- Use Tailwind utilities over custom CSS
- Add proper error handling

### Component Development
1. Create TypeScript interfaces for props
2. Add loading and error states
3. Include responsive design
4. Add proper accessibility attributes

### Testing
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build check
npm run build
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
```bash
# Build production bundle
npm run build

# Serve static files
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

#### CORS Errors
Ensure backend allows `http://localhost:3000` in CORS configuration.

#### Authentication Issues
- Check JWT token expiration
- Verify backend authentication endpoints
- Clear browser cookies if needed

#### Chart Loading Issues
- Ensure Recharts is properly installed
- Check for JavaScript errors in console
- Verify data format matches chart requirements

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# TypeScript checking
npm run type-check
```

## Future Enhancements

### Planned Features
- [ ] QR code generation for URLs
- [ ] Custom URL aliases
- [ ] Bulk URL operations
- [ ] Export analytics data
- [ ] Dark mode theme
- [ ] PWA capabilities
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering options

### Performance Improvements
- [ ] Service worker caching
- [ ] Chart virtualization for large datasets
- [ ] Image lazy loading
- [ ] Bundle size optimization

---

**Frontend Version:** 1.0.0  
**Last Updated:** December 2024  
**Framework:** Next.js 14 + TypeScript
