import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, redirect } from '@tanstack/react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { BinMonitoring } from './pages/BinMonitoring';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { MapView } from './pages/MapView';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { BinProvider } from './contexts/BinContext';
import { ToastContainer } from './components/ToastContainer';

// Root route
const rootRoute = createRootRoute();

// Public routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Dashboard layout route
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: DashboardLayout,
});

// Dashboard child routes
const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardOverview,
});

const binMonitoringRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/bin-monitoring',
  component: BinMonitoring,
});

const analyticsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/analytics',
  component: Analytics,
});

const alertsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/alerts',
  component: Alerts,
});

const mapViewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/map-view',
  component: MapView,
});

const reportsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/reports',
  component: Reports,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/settings',
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    binMonitoringRoute,
    analyticsRoute,
    alertsRoute,
    mapViewRoute,
    reportsRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BinProvider>
          <ToastProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </ToastProvider>
        </BinProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
