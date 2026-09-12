import React from 'react';
import { Users, Luggage, ShieldCheck, BadgeDollarSign } from 'lucide-react';
import type { FleetAdvantage } from '../types';

interface FleetAdvantagesProps {
  advantages: FleetAdvantage[];
}

const ICON_MAP = {
  Users,
  Luggage,
  ShieldCheck,
  BadgeDollarSign,
};

export const FleetAdvantages: React.FC<FleetAdvantagesProps> = ({ advantages }) => {
  return (
    <section
      id="fleet-advantages-section"
      className="border-t border-stone-800/80 bg-gradient-to-b from-stone-900/40 to-stone-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            專業堅持
          </span>
          <h2
            id="fleet-advantages-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl"
          >
            車隊 4 大專業優勢
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            高山險峻，選擇經驗豐富的接駁車隊是平安下山最重要的關鍵
          </p>
        </div>

        {/* 4 Advantages Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((adv) => {
            const IconComp = ICON_MAP[adv.iconName] || ShieldCheck;

            return (
              <div
                key={adv.id}
                id={`advantage-${adv.id}`}
                className="flex flex-col items-start rounded-xl border border-stone-800 bg-stone-900/60 p-6 transition-all hover:border-emerald-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <IconComp className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-stone-100">
                  {adv.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
