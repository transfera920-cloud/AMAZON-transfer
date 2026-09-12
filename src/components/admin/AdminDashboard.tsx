import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mountain,
  Sparkles,
  Search,
  Database,
  Activity,
  ArrowLeft,
  LogOut,
  Save,
  CheckCircle2,
  RefreshCw,
  Home,
} from 'lucide-react';
import type { CmsData } from '../../types';
import { RouteManager } from './RouteManager';
import { ServiceManager } from './ServiceManager';
import { SeoManager } from './SeoManager';
import { ImportExportManager } from './ImportExportManager';
import { SystemStatusView } from './SystemStatusView';

interface AdminDashboardProps {
  onLogout: () => void;
  onExit: () => void;
}

type TabType = 'routes' | 'services' | 'settings' | 'seo' | 'import-export' | 'status';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onExit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('routes');
  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings tab local state
  const [brandForm, setBrandForm] = useState({
    name: '',
    phone: '',
    email: '',
    lineUrl: '',
    quoteUrl: '',
  });
  const [heroForm, setHeroForm] = useState({
    h1: '',
    subtitle: '',
    ctaText: '',
    ctaUrl: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/data');
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) {
        throw new Error('無法讀取後台資料');
      }
      const json: CmsData = await res.json();
      setData(json);
      setBrandForm(json.brand);
      setHeroForm(json.hero);
    } catch (err: any) {
      setError(err.message || '連線錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brandForm, hero: heroForm }),
      });
      if (!res.ok) throw new Error('儲存基本設定失敗');
      setSettingsMsg('基本設定與首頁文案已成功儲存並同步');
      fetchData();
    } catch (err: any) {
      setSettingsMsg(`錯誤：${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-emerald-400">亞馬遜高山接駁</span>
            <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-500/30">
              CMS 後台管理
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center space-x-1 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700 hover:text-white"
            >
              <Home className="h-3.5 w-3.5" />
              <span>瀏覽前台</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="inline-flex items-center space-x-1 rounded-lg bg-stone-800 px-3 py-1.5 text-xs text-stone-400 hover:bg-red-950 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>登出</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('routes')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'routes'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Mountain className="h-3.5 w-3.5" />
            <span>熱門接駁路線</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>加值服務與 D0 民宿</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>基本設定與首頁文案</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'seo'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>SEO 與中繼標記</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import-export')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'import-export'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>資料匯入／匯出</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'status'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>系統狀態</span>
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && !data && (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Tab Content Panes */}
        {data && (
          <div>
            {activeTab === 'routes' && (
              <RouteManager routes={data.routes} onRefresh={fetchData} />
            )}

            {activeTab === 'services' && (
              <ServiceManager services={data.services} onRefresh={fetchData} />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-100">網站基本設定與首頁核心內容</h3>
                  <p className="text-xs text-stone-400">
                    設定品牌聯絡方式、LINE 官方帳號、線上即時算價連結及首頁 Hero 核心文案。
                  </p>
                </div>

                {settingsMsg && (
                  <div className="rounded-lg border border-emerald-800 bg-emerald-950/50 p-3 text-xs text-emerald-300">
                    {settingsMsg}
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Brand Contact Section */}
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-4">
                      品牌與聯絡資訊
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-stone-300">品牌名稱</label>
                        <input
                          type="text"
                          value={brandForm.name}
                          onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-300">預約電話</label>
                        <input
                          type="text"
                          value={brandForm.phone}
                          onChange={(e) => setBrandForm({ ...brandForm, phone: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-300">聯絡 Email</label>
                        <input
                          type="email"
                          value={brandForm.email}
                          onChange={(e) => setBrandForm({ ...brandForm, email: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-300">LINE 官方預約網址</label>
                        <input
                          type="url"
                          value={brandForm.lineUrl}
                          onChange={(e) => setBrandForm({ ...brandForm, lineUrl: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-stone-300">線上即時估價系統網址</label>
                        <input
                          type="url"
                          value={brandForm.quoteUrl}
                          onChange={(e) => setBrandForm({ ...brandForm, quoteUrl: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Content Section */}
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-4">
                      首頁 Hero 核心文案
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-stone-300">Hero 主標題 (唯一主要 H1)</label>
                        <input
                          type="text"
                          value={heroForm.h1}
                          onChange={(e) => setHeroForm({ ...heroForm, h1: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-300">Hero 副標題</label>
                        <textarea
                          rows={2}
                          value={heroForm.subtitle}
                          onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                          required
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-stone-300">主要行動按鈕 (CTA) 文字</label>
                          <input
                            type="text"
                            value={heroForm.ctaText}
                            onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                            required
                            className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-stone-300">CTA 跳轉網址</label>
                          <input
                            type="url"
                            value={heroForm.ctaUrl}
                            onChange={(e) => setHeroForm({ ...heroForm, ctaUrl: e.target.value })}
                            required
                            className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
                    >
                      <Save className="mr-1.5 h-4 w-4" />
                      <span>{savingSettings ? '儲存中...' : '儲存變更'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'seo' && (
              <SeoManager seo={data.seo} onRefresh={fetchData} />
            )}

            {activeTab === 'import-export' && (
              <ImportExportManager onRefresh={fetchData} />
            )}

            {activeTab === 'status' && <SystemStatusView />}
          </div>
        )}
      </div>
    </div>
  );
};
