import React, { useState } from 'react';
import { Save, RefreshCw, Globe, CheckCircle2 } from 'lucide-react';
import type { SeoSettings } from '../../types';

interface SeoManagerProps {
  seo: SeoSettings;
  onRefresh: () => void;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ seo, onRefresh }) => {
  const [form, setForm] = useState<SeoSettings>({ ...seo });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'SEO 設定儲存失敗');

      showMsg('SEO 設定已成功更新，伺服器預渲染與中繼標記已同步');
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || '儲存失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-stone-100">極致 SEO 與社群中繼標記設定</h3>
          <p className="text-xs text-stone-400">
            全站 SEO 設定由伺服器端（SSR）於原始 HTML 輸出前動態注入，即時同步 Google 爬蟲與社群分享。
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700"
        >
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          <span>重新載入</span>
        </button>
      </div>

      {msg && (
        <div
          className={`rounded-lg p-3 text-xs ${
            msg.type === 'success'
              ? 'border border-emerald-800/50 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-800/50 bg-red-950/40 text-red-300'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Google Search Result Preview Simulation */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
          <Globe className="h-4 w-4" />
          <span>Google 搜尋引擎展示預覽</span>
        </div>
        <div className="rounded-lg bg-stone-950 p-3 font-sans">
          <div className="text-xs text-stone-400 flex items-center space-x-1">
            <span>https://amazon-shuttle.example.com</span>
            <span>›</span>
            <span>首頁</span>
          </div>
          <div className="mt-1 text-base font-semibold text-blue-400 hover:underline cursor-pointer">
            {form.siteTitle || '亞馬遜高山接駁｜全國登山口專業包車與接駁服務'}
          </div>
          <div className="mt-1 text-xs text-stone-300 line-clamp-2">
            {form.metaDescription ||
              '亞馬遜高山接駁提供全台百岳及登山口專業包車接駁服務。熟悉全台高山與林道路況，安全舒適、準時抵達，線上 10 秒即時算價！'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/40 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Site Title */}
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-stone-300">
                網頁標題 (Title Tag) *
              </label>
              <span className="text-[11px] text-stone-500">
                建議長度 50–60 字元（目前：{form.siteTitle?.length || 0}）
              </span>
            </div>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Meta Description */}
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-stone-300">
                網頁描述 (Meta Description) *
              </label>
              <span className="text-[11px] text-stone-500">
                建議長度 120–160 字元（目前：{form.metaDescription?.length || 0}）
              </span>
            </div>
            <textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Keywords */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-300">
              關鍵字標籤 (Meta Keywords, 逗點分隔)
            </label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="高山接駁, 登山口接駁, 登山包車, 百岳接駁..."
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-medium text-stone-300">
              標準網址 (Canonical URL，留空則自動偵測)
            </label>
            <input
              type="url"
              value={form.canonical}
              onChange={(e) => setForm({ ...form, canonical: e.target.value })}
              placeholder="https://your-domain.com/"
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Robots */}
          <div>
            <label className="block text-xs font-medium text-stone-300">
              檢索器指令 (Robots)
            </label>
            <select
              value={form.robots}
              onChange={(e) => setForm({ ...form, robots: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="index, follow">index, follow (建議正常收錄)</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>

          {/* Open Graph Title */}
          <div>
            <label className="block text-xs font-medium text-stone-300">
              社群分享標題 (og:title)
            </label>
            <input
              type="text"
              value={form.ogTitle}
              onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Open Graph Description */}
          <div>
            <label className="block text-xs font-medium text-stone-300">
              社群分享說明 (og:description)
            </label>
            <input
              type="text"
              value={form.ogDescription}
              onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
          >
            <Save className="mr-1.5 h-4 w-4" />
            <span>{loading ? '儲存同步中...' : '儲存並同步 SEO 設定'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
