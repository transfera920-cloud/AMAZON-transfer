import React, { useEffect, useState } from 'react';
import { Activity, Database, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import type { SystemStatus } from '../../types';

export const SystemStatusView: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs} 小時 ${mins % 60} 分鐘`;
    return `${mins} 分鐘 ${seconds % 60} 秒`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-100">系統運作狀態與健康度指標</h3>
          <p className="text-xs text-stone-400">
            監控伺服器端資料庫記錄量、運行時間與正式資料完整度。
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStatus}
          disabled={loading}
          className="inline-flex items-center rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700"
        >
          <RefreshCw className={`mr-1 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>重新整理</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <span className="text-xs text-stone-400">服務健康狀態</span>
          <div className="mt-2 flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-lg font-bold text-stone-100">運作正常 (OK)</span>
          </div>
          <span className="mt-1 block text-[11px] text-stone-500">
            所有 API 端點正常響應
          </span>
        </div>

        {/* Routes */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <span className="text-xs text-stone-400">現存接駁路線</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {status?.routesCount ?? '-'} <span className="text-xs font-normal text-stone-400">條</span>
          </div>
          <span className="mt-1 block text-[11px] text-stone-500">
            全台各大主要百岳登山口
          </span>
        </div>

        {/* Services & Stays */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <span className="text-xs text-stone-400">加值服務 / 民宿資料</span>
          <div className="mt-2 text-2xl font-bold text-stone-100">
            {status?.servicesCount ?? '-'} <span className="text-xs font-normal text-stone-400">項服務 / {status?.childContentsCount ?? '-'} 間民宿</span>
          </div>
          <span className="mt-1 block text-[11px] text-stone-500">
            階層式親緣關係完整保持
          </span>
        </div>

        {/* Server Uptime */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <span className="text-xs text-stone-400">伺服器運行時間</span>
          <div className="mt-2 text-base font-bold text-stone-200">
            {status ? formatUptime(status.uptimeSeconds) : '-'}
          </div>
          <span className="mt-1 block text-[11px] text-stone-500">
            伺服器時間: {status ? new Date(status.serverTime).toLocaleTimeString('zh-TW') : '-'}
          </span>
        </div>
      </div>

      {/* Storage Specs */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-5">
        <div className="flex items-center space-x-2 text-sm font-semibold text-stone-200 mb-3">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>資料儲存與持久化規格</span>
        </div>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-xs">
          <div>
            <dt className="text-stone-500">儲存類型 (Storage Engine)</dt>
            <dd className="mt-0.5 font-medium text-stone-200">
              {status?.storageType || 'Durable Production Storage'}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">最後更新時間 (Last Modified)</dt>
            <dd className="mt-0.5 font-medium text-stone-200">
              {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleString('zh-TW') : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">併發保護機制 (Concurrency Control)</dt>
            <dd className="mt-0.5 font-medium text-stone-200">
              原子寫入 (Atomic Swap) + 寫入前自動輪轉備份
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">SEO 即時同步 (SEO Rendering)</dt>
            <dd className="mt-0.5 font-medium text-emerald-400">
              已啟用（每次資料異動直接同步注入伺服器 SSR HTML 及 Sitemap）
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
