import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import type { ServiceItem } from '../types';

interface AddonServicesProps {
  services: ServiceItem[];
}

export const AddonServices: React.FC<AddonServicesProps> = ({ services }) => {
  // Keep track of which service accordion/detail is open
  const [expandedId, setExpandedId] = useState<string | null>(
    services.find((s) => s.contents && s.contents.length > 0)?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="addon-services-section" className="border-t border-stone-800/80 bg-stone-900/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>登山全方位後勤支援</span>
          </div>
          <h2
            id="addon-services-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl"
          >
            加值服務
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            專為登山客打造的完善後勤，讓行前與下山行程更從容
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => {
            const hasChildren = service.contents && service.contents.length > 0;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/60 p-6 transition-all hover:border-stone-700"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-stone-100">
                    {service.name}
                  </h3>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(service.id)}
                      className="inline-flex items-center space-x-1 rounded-md bg-stone-800/80 px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-stone-700"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? '收合名單' : '查看民宿'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {service.description}
                </p>

                {/* Sub-items (e.g. D0 民宿子項目) */}
                {hasChildren && isExpanded && (
                  <div className="mt-5 space-y-3 rounded-lg border border-stone-800/80 bg-stone-950/70 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                      合作民宿資訊與代訂指引
                    </div>
                    {service.contents.map((child) => (
                      <div
                        key={child.id}
                        id={`child-content-${child.id}`}
                        className="border-t border-stone-800/60 pt-3 first:border-0 first:pt-0"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-stone-200">
                            {child.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {child.phone && (
                              <a
                                href={`tel:${child.phone}`}
                                title="電話預約代洽"
                                className="inline-flex items-center text-xs text-stone-400 hover:text-emerald-300"
                              >
                                <Phone className="mr-1 h-3 w-3" aria-hidden="true" />
                                <span>{child.phone}</span>
                              </a>
                            )}
                            {child.url && (
                              <a
                                href={child.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-emerald-400 hover:text-emerald-300"
                              >
                                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                        {child.description && (
                          <p className="mt-1 text-xs text-stone-400">
                            {child.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
