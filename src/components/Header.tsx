import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import type { BrandInfo } from '../types';

interface HeaderProps {
  brand: BrandInfo;
}

export const Header: React.FC<HeaderProps> = ({ brand }) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Name */}
        <a
          id="header-brand-link"
          href="/"
          className="flex items-center space-x-2 text-stone-100 transition-colors hover:text-emerald-400"
        >
          <span className="font-sans text-xl font-bold tracking-tight sm:text-2xl">
            {brand.name}
          </span>
        </a>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* 線上估價系統 */}
          <a
            id="header-quote-button"
            href={brand.quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-950 active:scale-95"
          >
            <span>線上估價系統</span>
            <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          </a>

          {/* LINE 官方預約 */}
          <a
            id="header-line-button"
            href={brand.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm font-medium text-stone-200 transition-all hover:border-emerald-500/50 hover:bg-stone-800 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-950 active:scale-95"
          >
            <MessageCircle className="mr-1.5 h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>LINE 官方預約</span>
          </a>
        </div>
      </div>
    </header>
  );
};
