import React from 'react';
import { ExternalLink, Mountain } from 'lucide-react';
import type { RouteItem } from '../types';

interface PopularRoutesProps {
  routes: RouteItem[];
}

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ routes }) => {
  return (
    <section id="popular-routes-section" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Mountain className="h-4 w-4" aria-hidden="true" />
            <span>全台主要登山路線</span>
          </div>
          <h2
            id="popular-routes-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl"
          >
            熱門接駁路線
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            點擊路線即可使用即時系統精準算價，各山區專車接送
          </p>
        </div>

        {/* Minimalist Route Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <div
              key={route.id}
              id={`route-card-${route.id}`}
              className="flex flex-col justify-between rounded-xl border border-stone-800/90 bg-stone-900/70 p-5 transition-all hover:border-emerald-500/40 hover:bg-stone-900/90"
            >
              <div>
                {/* Tag */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-300">
                    {route.tag || '⚡ 10秒即時算價'}
                  </span>
                </div>

                {/* Route / Region Name */}
                <h3 className="text-base font-semibold text-stone-100 sm:text-lg">
                  {route.name}
                </h3>

                {/* Brief description if available in CMS */}
                {route.description ? (
                  <p className="mt-2 text-xs leading-relaxed text-stone-400">
                    {route.description}
                  </p>
                ) : null}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-800/60">
                <a
                  id={`route-calc-link-${route.id}`}
                  href={route.quoteUrl || 'https://summit-route-advisor.lovable.app/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-stone-800/80 px-3 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <span>試算此路線</span>
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
