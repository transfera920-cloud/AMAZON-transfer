import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2, FileText, Database } from 'lucide-react';
import type { CmsData } from '../../types';

interface ImportExportManagerProps {
  onRefresh: () => void;
}

export const ImportExportManager: React.FC<ImportExportManagerProps> = ({ onRefresh }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importMode, setImportMode] = useState<'REPLACE' | 'MERGE'>('REPLACE');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ type, text });
  };

  const handleExportBackup = () => {
    window.location.href = '/api/admin/export';
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      showMsg('請先貼入或上傳欲匯入的 JSON 內容', 'error');
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err: any) {
      showMsg(`JSON 語法錯誤：${err.message}`, 'error');
      return;
    }

    if (
      importMode === 'REPLACE' &&
      !window.confirm('確定要以匯入的資料覆蓋現有資料嗎？系統將在覆蓋前自動於伺服器留存一份備份。')
    ) {
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsed, mode: importMode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '匯入失敗');
      }

      showMsg(`匯入成功！${data.message || ''}`, 'success');
      setJsonInput('');
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || '匯入時發生錯誤', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-100">資料匯出備份與嚴格檢驗匯入</h3>
        <p className="text-xs text-stone-400">
          符合正式環境嚴格資料安全原則：匯入前全量校驗、自動備份留存、拒絕重複 ID 與孤立記錄。
        </p>
      </div>

      {msg && (
        <div
          className={`flex items-start space-x-2 rounded-lg p-3 text-xs ${
            msg.type === 'success'
              ? 'border border-emerald-800/50 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-800/50 bg-red-950/40 text-red-300'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
        <div className="flex items-center space-x-2 text-sm font-semibold text-stone-200">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>生產正式資料完整備份 (Export)</span>
        </div>
        <p className="mt-1 text-xs text-stone-400">
          直接從後端資料庫讀取當前最新的完整資料（含路線、服務、子項目、SEO及品牌設定），下載為標準 JSON 檔案。
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center rounded-lg bg-stone-800 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-stone-700 hover:text-white"
          >
            <Download className="mr-1.5 h-4 w-4" />
            <span>下載完整資料庫備份檔案 (.json)</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
        <div className="flex items-center space-x-2 text-sm font-semibold text-stone-200">
          <Upload className="h-4 w-4 text-emerald-400" />
          <span>資料安全匯入 (Import)</span>
        </div>
        <p className="mt-1 text-xs text-stone-400">
          伺服器將在寫入前嚴格驗證所有資料結構與關聯性。若有任何錯誤將全量復原，確保不產生破損記錄。
        </p>

        <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-400">
                選擇檔案或直接於下方文字框貼入 JSON
              </label>
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="mt-1 block text-xs text-stone-400 file:mr-2 file:rounded-md file:border-0 file:bg-stone-800 file:px-2.5 file:py-1 file:text-xs file:text-stone-300 hover:file:bg-stone-700"
              />
            </div>

            <div className="ml-auto">
              <label className="block text-xs font-medium text-stone-400">匯入模式</label>
              <select
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as any)}
                className="mt-1 rounded border border-stone-700 bg-stone-950 px-3 py-1 text-xs text-stone-200"
              >
                <option value="REPLACE">全量替換 (REPLACE，寫入前自動在伺服器備份)</option>
                <option value="MERGE">增量合併 (MERGE)</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="在此貼上備份 JSON 內容..."
              className="w-full rounded-lg border border-stone-700 bg-stone-950 p-3 font-mono text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !jsonInput.trim()}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              <Upload className="mr-1.5 h-4 w-4" />
              <span>{loading ? '驗證寫入中...' : '校驗並執行匯入'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
