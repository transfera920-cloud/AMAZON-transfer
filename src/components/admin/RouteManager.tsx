import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Check, RefreshCw } from 'lucide-react';
import type { RouteItem } from '../../types';

interface RouteManagerProps {
  routes: RouteItem[];
  onRefresh: () => void;
}

export const RouteManager: React.FC<RouteManagerProps> = ({ routes, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RouteItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    tag: '⚡ 10秒即時算價',
    description: '',
    quoteUrl: 'https://summit-route-advisor.lovable.app/',
    sort: routes.length + 1,
    enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleStartEdit = (route: RouteItem) => {
    setEditingId(route.id);
    setEditForm({ ...route });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '儲存失敗');

      showMsg('路線更新成功');
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || '更新失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (route: RouteItem) => {
    try {
      const res = await fetch(`/api/admin/routes/${route.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !route.enabled }),
      });
      if (!res.ok) throw new Error('狀態切換失敗');
      onRefresh();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`確定要刪除「${name}」接駁路線嗎？此操作將永久移除此記錄。`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/routes/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '刪除失敗');

      showMsg('路線已成功刪除');
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || '刪除失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim()) {
      showMsg('路線名稱為必填項目', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '新增失敗');

      showMsg('新接駁路線已成功建立');
      setIsAdding(false);
      setNewForm({
        name: '',
        tag: '⚡ 10秒即時算價',
        description: '',
        quoteUrl: 'https://summit-route-advisor.lovable.app/',
        sort: routes.length + 2,
        enabled: true,
      });
      onRefresh();
    } catch (err: any) {
      showMsg(err.message || '新增失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-stone-100">熱門接駁路線管理</h3>
          <p className="text-xs text-stone-400">
            維護首頁展示之登山接駁路線。卡片簡潔、不自行編造價格或未經驗證的地點。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700"
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            <span>重新整理</span>
          </button>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <Plus className="mr-1 h-4 w-4" />
              <span>新增接駁路線</span>
            </button>
          )}
        </div>
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

      {/* Add New Route Drawer / Card */}
      {isAdding && (
        <div className="rounded-xl border border-emerald-500/40 bg-stone-900/90 p-5">
          <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-3">
            <h4 className="text-sm font-bold text-emerald-400">新增接駁路線</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-stone-300">路線／區域名稱 *</label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="例如：合歡山・奇萊群峰接駁"
                  required
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300">特色標籤</label>
                <input
                  type="text"
                  value={newForm.tag}
                  onChange={(e) => setNewForm({ ...newForm, tag: e.target.value })}
                  placeholder="例如：⚡ 10秒即時算價"
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-stone-300">路線簡介／涵蓋登山口</label>
                <input
                  type="text"
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="例如：合歡西北峰、奇萊主北，松雪樓與滑雪山莊出發"
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300">算價系統連結 (預設 Lovable)</label>
                <input
                  type="text"
                  value={newForm.quoteUrl}
                  onChange={(e) => setNewForm({ ...newForm, quoteUrl: e.target.value })}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-xs text-stone-300">排序權重 (數字越小越前面)</label>
                  <input
                    type="number"
                    value={newForm.sort}
                    onChange={(e) => setNewForm({ ...newForm, sort: Number(e.target.value) })}
                    className="mt-1 w-24 rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                  />
                </div>
                <div className="pt-4">
                  <label className="inline-flex items-center space-x-2 text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={newForm.enabled}
                      onChange={(e) => setNewForm({ ...newForm, enabled: e.target.checked })}
                      className="rounded border-stone-700 bg-stone-950 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>在前台啟用顯示</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded border border-stone-700 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                確認新增
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routes List Table */}
      <div className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="border-b border-stone-800 bg-stone-950/80 text-[11px] uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3 px-4">排序</th>
                <th className="py-3 px-4">路線名稱</th>
                <th className="py-3 px-4">標籤</th>
                <th className="py-3 px-4">簡介</th>
                <th className="py-3 px-4">狀態</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {routes.map((route) => {
                const isEditing = editingId === route.id;

                if (isEditing) {
                  return (
                    <tr key={route.id} className="bg-stone-900">
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editForm.sort ?? route.sort}
                          onChange={(e) =>
                            setEditForm({ ...editForm, sort: Number(e.target.value) })
                          }
                          className="w-16 rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-100"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.name ?? route.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-100"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.tag ?? route.tag}
                          onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                          className="w-28 rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-100"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.description ?? route.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="w-full rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-100"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={editForm.enabled ?? route.enabled}
                            onChange={(e) =>
                              setEditForm({ ...editForm, enabled: e.target.checked })
                            }
                            className="rounded border-stone-700 bg-stone-950 text-emerald-600"
                          />
                          <span>啟用</span>
                        </label>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(route.id)}
                            disabled={loading}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="rounded border border-stone-700 px-2 py-1 text-xs text-stone-400 hover:bg-stone-800"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={route.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono text-stone-400">{route.sort}</td>
                    <td className="py-3 px-4 font-medium text-stone-100">{route.name}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-emerald-950/60 px-1.5 py-0.5 text-[11px] text-emerald-400 border border-emerald-500/30">
                        {route.tag}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400 max-w-xs truncate">
                      {route.description || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleEnabled(route)}
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                          route.enabled
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {route.enabled ? '顯示中' : '已停用'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(route)}
                          className="text-stone-400 hover:text-emerald-400"
                          title="編輯路線"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(route.id, route.name)}
                          className="text-stone-400 hover:text-red-400"
                          title="刪除路線"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
