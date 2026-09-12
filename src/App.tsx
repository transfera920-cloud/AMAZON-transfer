import React, { useEffect, useState } from 'react';
import type { PublicCmsData } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PopularRoutes } from './components/PopularRoutes';
import { AddonServices } from './components/AddonServices';
import { BookingSteps } from './components/BookingSteps';
import { FleetAdvantages } from './components/FleetAdvantages';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<PublicCmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin routing state
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname.startsWith('/admin')
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Listen to popstate for URL navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check admin session
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        if (res.ok) {
          const json = await res.json();
          setIsAdminAuthenticated(Boolean(json.authenticated));
        }
      } catch (e) {
        setIsAdminAuthenticated(false);
      }
    };
    verifyAuth();
  }, [isAdminView]);

  // Fetch public authoritative data from server API
  const fetchPublicData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cms/public');
      if (!res.ok) throw new Error('無法載入網站資料');
      const json: PublicCmsData = await res.json();
      setData(json);

      // Dynamically update document title on client
      if (json.seo && json.seo.siteTitle) {
        document.title = json.seo.siteTitle;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '連線錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    fetchPublicData();
  };

  // If in admin view
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onCancel={navigateToHome}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => setIsAdminAuthenticated(false)}
        onExit={navigateToHome}
      />
    );
  }

  // Public Loading Screen
  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-300">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-7 w-7 animate-spin text-emerald-500" />
          <span className="text-sm font-medium tracking-wide">亞馬遜高山接駁 載入中...</span>
        </div>
      </div>
    );
  }

  // Public Error Screen
  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4 text-stone-200">
        <div className="max-w-md rounded-xl border border-red-800/80 bg-stone-900 p-6 text-center shadow-lg">
          <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
          <h2 className="mt-3 text-lg font-bold">載入錯誤</h2>
          <p className="mt-1 text-xs text-stone-400">{error}</p>
          <button
            type="button"
            onClick={fetchPublicData}
            className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            重試連線
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100 selection:bg-emerald-800 selection:text-white">
      {/* 1. Navigation Header */}
      <Header brand={data.brand} />

      <main className="flex-1">
        {/* 2. Hero Section with single-line H1 & CTA */}
        <Hero hero={data.hero} />

        {/* 3. 熱門接駁路線 (Popular Routes) */}
        <PopularRoutes routes={data.routes} />

        {/* 4. 加值服務 (Add-on Services with D0 stays) */}
        <AddonServices services={data.services} />

        {/* 5. 預約流程 (4-Step Booking Process) */}
        <BookingSteps steps={data.bookingSteps} />

        {/* 6. 車隊 4 大專業優勢 (Fleet Advantages - MUST be last main section) */}
        <FleetAdvantages advantages={data.fleetAdvantages} />
      </main>

      {/* 7. Footer with direct actions & low-key admin link */}
      <Footer brand={data.brand} onOpenAdmin={navigateToAdmin} />
    </div>
  );
}
