import React from 'react';
import { Phone, Mail, MessageCircle, Settings } from 'lucide-react';
import type { BrandInfo } from '../types';

interface FooterProps {
  brand: BrandInfo;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, onOpenAdmin }) => {
  return (
    <footer id="main-footer" className="border-t border-stone-800 bg-stone-950 py-12 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Direct Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {/* 電話預約 */}
            <a
              id="footer-phone-link"
              href={`tel:${brand.phone}`}
              className="inline-flex items-center space-x-2 text-sm text-stone-300 transition-colors hover:text-emerald-400"
            >
              <Phone className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>電話預約：{brand.phone}</span>
            </a>

            {/* Email */}
            <a
              id="footer-email-link"
              href={`mailto:${brand.email}`}
              className="inline-flex items-center space-x-2 text-sm text-stone-300 transition-colors hover:text-emerald-400"
            >
              <Mail className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <span>{brand.email}</span>
            </a>

            {/* LINE 官方 */}
            <a
              id="footer-line-link"
              href={brand.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm text-stone-300 transition-colors hover:text-emerald-400"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>LINE 官方預約</span>
            </a>
          </div>

          {/* Copyright & Discreet Admin Link */}
          <div className="flex items-center space-x-4 text-xs text-stone-400">
            <span id="footer-copyright">© {brand.name}</span>

            <span className="text-stone-700" aria-hidden="true">|</span>

            {/* 後台管理 (低調按鈕) */}
            <button
              id="footer-admin-button"
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1 text-stone-400 transition-colors hover:text-stone-300 focus:outline-none"
              title="後台管理系統"
            >
              <Settings className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              <span>後台管理</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
