import React from 'react';
import { Calculator, MessageSquare, CreditCard, Compass } from 'lucide-react';
import type { BookingStep } from '../types';

interface BookingStepsProps {
  steps: BookingStep[];
}

const STEP_ICONS = [Calculator, MessageSquare, CreditCard, Compass];

export const BookingSteps: React.FC<BookingStepsProps> = ({ steps }) => {
  return (
    <section id="booking-steps-section" className="border-t border-stone-800/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            預約流程
          </span>
          <h2
            id="booking-steps-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl"
          >
            簡單四步驟，安心完成包車預約
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            透明化標準流程，出發前確認所有細節
          </p>
        </div>

        {/* 4 Steps Container */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const IconComponent = STEP_ICONS[idx % STEP_ICONS.length];

            return (
              <div
                key={step.step}
                id={`booking-step-${step.step}`}
                className="relative flex flex-col rounded-xl border border-stone-800 bg-stone-900/40 p-6 transition-all hover:border-emerald-500/30"
              >
                {/* Step indicator badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-400">
                    STEP 0{step.step}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-stone-100">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
