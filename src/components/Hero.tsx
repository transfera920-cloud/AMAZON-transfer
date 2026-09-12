import React from 'react';
import { ExternalLink, Compass } from 'lucide-react';
import type { HeroContent } from '../types';

interface HeroProps {
  hero: HeroContent;
}

export const Hero: React.FC<HeroProps> = ({ hero }) => {
  return (
    <section
      id="hero-section"
      className="relative flex min-h-[82vh] w-full flex-col justify-center overflow-hidden border-b border-stone-800 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Dark Alpine Visual Backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Subtle radial glow */}
        <div className="absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-900/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />
        
        {/* Mountain ridge outline silhouettes */}
        <svg
          className="absolute -bottom-4 left-0 right-0 w-full opacity-15"
          viewBox="0 0 1440 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 240L180 140L360 190L540 80L720 160L900 60L1080 150L1260 90L1440 240H0Z"
            fill="#10b981"
          />
          <path
            d="M0 240L240 160L480 200L720 120L960 180L1200 110L1440 240H0Z"
            fill="#064e3b"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-300">
          <Compass className="mr-1.5 h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span>全台登山口與百岳行程專業包車</span>
        </div>

        {/* 
          CRITICAL H1 RULE: 
          H1 MUST remain a single visual line. NEVER arbitrarily wrap the title. 
          Responsive font scaling ensures single-line presentation across all viewports.
        */}
        <div className="w-full overflow-hidden px-1">
          <h1
            id="hero-title"
            className="w-full whitespace-nowrap text-center font-bold tracking-tight text-stone-100 text-[1.125rem] xs:text-[1.35rem] sm:text-[1.85rem] md:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.1rem]"
          >
            {hero.h1}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          id="hero-subtitle"
          className="mt-6 max-w-3xl text-balance text-base font-normal leading-relaxed text-stone-300 sm:text-lg md:text-xl"
        >
          {hero.subtitle}
        </p>

        {/* Primary CTA */}
        <div className="mt-10 flex flex-col items-center sm:flex-row sm:justify-center">
          <a
            id="hero-cta-button"
            href={hero.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-950 active:scale-95 sm:text-lg"
          >
            <span>{hero.ctaText}</span>
            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
