import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronUp, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import type { ServiceItem, ChildContent } from '../../types';

interface ServiceManagerProps {
  services: ServiceItem[];
  onRefresh: () => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({ services, onRefresh }) => {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(services[0]?.id || null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceEditForm, setServiceEditForm] = useState<Partial<ServiceItem>>({});

  // Adding child state
  const [addingChildForServiceId, setAddingChildForServiceId] = useState<string | null>(null);
  const [childForm, setChildForm] = useState({
    name: '',
    description: '',
    phone: '0972573495',
    url: 'https://lin.ee/TO7bDic',
    line: '@amazon_shuttle',
    enabled: true,
    sort: 1,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedServiceId((prev) => (prev === id ? null : id));
  };

  const handleStartEditService = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setServiceEditForm({ ...srv });
  };

  const handleSaveService = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceEditForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '儲存服務失敗');

      showMsg('服務已成功更新');
      setEditingServiceId(null);
      onRefresh();
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (serviceId: string) => {
    if (!childForm.name.trim()) {
      showMsg('子項目/民宿名稱為必填', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(childForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '新增子項目失敗');

      showMsg('成功新增子項目/合作民宿');
      setAddingChildForServiceId(null);
      setChildForm({
        name: '',
        description: '',
        phone: '0972573495',
        url: 'https://lin.ee/TO7bDic',
        line: '@amazon_shuttle',
        enabled: true,
        sort: 1,
      });
      onRefresh();
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = async (serviceId: string, childId: string, childName: string) => {
    if (!window.confirm(`確定要刪除「${childName}」嗎？`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/content/${childId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '刪除失敗');

      showMsg('子項目已刪除');
      onRefresh();
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-stone-100">加值服務與 D0 合作民宿管理</h3>
          <p className="text-xs text-stone-400">
            維護各項後勤加值服務及關聯子項目（如 D0 合作民宿名單、電話、預約連結）。
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700"
        >
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          <span>重新整理</span>
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

      {/* Services List with hierarchical child management */}
      <div className="space-y-4">
        {services.map((service) => {
          const isExpanded = expandedServiceId === service.id;
          const isEditing = editingServiceId === service.id;
          const contents = service.contents || [];

          return (
            <div
              key={service.id}
              className="rounded-xl border border-stone-800 bg-stone-900/70 p-5 transition-all"
            >
              {/* Service Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-400">服務名稱</label>
                        <input
                          type="text"
                          value={serviceEditForm.name ?? service.name}
                          onChange={(e) =>
                            setServiceEditForm({ ...serviceEditForm, name: e.target.value })
                          }
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-400">服務說明</label>
                        <textarea
                          rows={2}
                          value={serviceEditForm.description ?? service.description}
                          onChange={(e) =>
                            setServiceEditForm({
                              ...serviceEditForm,
                              description: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs text-stone-100"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSaveService(service.id)}
                          disabled={loading}
                          className="inline-flex items-center rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <Save className="mr-1 h-3.5 w-3.5" />
                          <span>儲存服務</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingServiceId(null)}
                          className="rounded border border-stone-700 px-3 py-1 text-xs text-stone-400 hover:bg-stone-800"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="text-base font-semibold text-stone-100">
                          {service.name}
                        </h4>
                        <span className="rounded bg-stone-800 px-2 py-0.5 text-[11px] text-stone-400">
                          子項目: {contents.length} 項
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[11px] ${
                            service.enabled
                              ? 'bg-emerald-950/80 text-emerald-400'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {service.enabled ? '啟用' : '停用'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-stone-400">
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleStartEditService(service)}
                      className="rounded p-1 text-stone-400 hover:text-stone-200"
                      title="編輯此服務"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(service.id)}
                      className="inline-flex items-center rounded bg-stone-800 px-2.5 py-1 text-xs text-stone-300 hover:bg-stone-700"
                    >
                      <span>{isExpanded ? '收合' : '展開管理子項目'}</span>
                      {isExpanded ? (
                        <ChevronUp className="ml-1 h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Items / Child Contents (e.g. D0 民宿名單) */}
              {isExpanded && (
                <div className="mt-5 border-t border-stone-800/80 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      「{service.name}」專屬子項目名單
                    </h5>
                    {addingChildForServiceId !== service.id && (
                      <button
                        type="button"
                        onClick={() => setAddingChildForServiceId(service.id)}
                        className="inline-flex items-center rounded bg-stone-800 px-2.5 py-1 text-xs text-emerald-400 hover:bg-stone-700"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        <span>新增子項目／民宿</span>
                      </button>
                    )}
                  </div>

                  {/* Add Child Form */}
                  {addingChildForServiceId === service.id && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-stone-950 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-emerald-300">
                          新增子項目至「{service.name}」
                        </span>
                        <button
                          type="button"
                          onClick={() => setAddingChildForServiceId(null)}
                          className="text-stone-500 hover:text-stone-300"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] text-stone-400">項目名稱 *</label>
                          <input
                            type="text"
                            value={childForm.name}
                            onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                            placeholder="例如：清境友善合作民宿"
                            className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-2.5 py-1 text-xs text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-400">聯絡電話</label>
                          <input
                            type="text"
                            value={childForm.phone}
                            onChange={(e) => setChildForm({ ...childForm, phone: e.target.value })}
                            placeholder="0972573495"
                            className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-2.5 py-1 text-xs text-stone-100"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-stone-400">項目說明</label>
                          <input
                            type="text"
                            value={childForm.description}
                            onChange={(e) =>
                              setChildForm({ ...childForm, description: e.target.value })
                            }
                            placeholder="例如：近合歡山出發點，備有登山熱水與裝備區"
                            className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-2.5 py-1 text-xs text-stone-100"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setAddingChildForServiceId(null)}
                          className="rounded border border-stone-700 px-2.5 py-1 text-xs text-stone-400 hover:bg-stone-800"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddChild(service.id)}
                          disabled={loading}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          確認新增
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Child Items Table */}
                  {contents.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-stone-800 p-4 text-center text-xs text-stone-500">
                      目前尚無子項目，可點擊上方「新增子項目」建立關聯內容。
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {contents.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950/60 p-3 text-xs"
                        >
                          <div>
                            <span className="font-medium text-stone-200">{child.name}</span>
                            {child.description && (
                              <p className="mt-0.5 text-stone-400 text-[11px]">
                                {child.description}
                              </p>
                            )}
                            <div className="mt-1 flex items-center space-x-3 text-[11px] text-stone-500">
                              {child.phone && <span>電話: {child.phone}</span>}
                              {child.line && <span>LINE: {child.line}</span>}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteChild(service.id, child.id, child.name)}
                              className="text-stone-500 hover:text-red-400"
                              title="刪除此子項目"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
