import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('請輸入管理員密碼');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || '登入失敗，請確認密碼是否正確');
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || '連線伺服器時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center text-xs text-stone-400 hover:text-stone-200"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            <span>返回前台首頁</span>
          </button>
          <span className="rounded bg-stone-800 px-2 py-0.5 text-[11px] font-mono text-stone-400">
            SERVER AUTH
          </span>
        </div>

        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-stone-100">管理後台登入</h2>
          <p className="mt-1 text-xs text-stone-400">
            亞馬遜高山接駁｜正式系統後台
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg border border-red-800/50 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-medium text-stone-300"
            >
              管理員密碼
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入後台管理密碼"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-lg border border-stone-700 bg-stone-950 px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? '驗證中...' : '安全登入'}
          </button>
        </form>
      </div>
    </div>
  );
};
