"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  CalendarCheck,
  Sparkles,
  Users,
  BarChart3,
  Eye,
  Layers,
  TrendingUp,
  CheckSquare,
  DoorOpen,
  PackageCheck,
  UserPlus,
  Wrench,
  Clock,
  DollarSign,
  LineChart,
  MessageSquare,
  BedDouble,
  CheckCircle2,
} from "lucide-react";
import { ShowcaseSchema } from "@/lib/content-schema";
import { z } from "zod";

type ShowcaseProps = z.infer<typeof ShowcaseSchema>;

const TAB_ICONS = [CalendarCheck, Sparkles, Users, BarChart3];

const TAB_FEATURE_ICONS = [
  [Eye, Layers, TrendingUp],
  [CheckSquare, DoorOpen, PackageCheck],
  [UserPlus, Wrench, Clock],
  [DollarSign, LineChart, MessageSquare],
];

export function Showcase({ tabs }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsAnimating(false);
    }, 120);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % tabs.length;
      handleTabChange(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + tabs.length) % tabs.length;
      handleTabChange(prev);
    }
  };

  const currentTab = tabs[activeTab];
  const featureIcons = TAB_FEATURE_ICONS[activeTab] || [Eye, Layers, TrendingUp];

  return (
    <section id="operations" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto">
      {/* Full-width Tabs Bar */}
      <div className="border-b border-border mb-12 sm:mb-16">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Operations Features"
          className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {tabs.map((tab, idx) => {
            const Icon = TAB_ICONS[idx] || CalendarCheck;
            const isActive = idx === activeTab;
            return (
              <button
                key={idx}
                role="tab"
                id={`showcase-tab-${idx}`}
                aria-selected={isActive}
                aria-controls={`showcase-panel-${idx}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flex items-center gap-2 pb-3.5 text-[13px] sm:text-[14px] font-medium whitespace-nowrap transition-colors relative border-b-2 -mb-[1px] ${
                  isActive
                    ? "text-text_primary border-text_primary"
                    : "text-text_muted hover:text-text_secondary border-transparent"
                }`}
              >
                <Icon size={16} className={isActive ? "text-sage_600" : "text-text_muted"} />
                <span>{tab.tab_label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Content Grid (≈45% text / 55% image) */}
      <div
        role="tabpanel"
        id={`showcase-panel-${activeTab}`}
        aria-labelledby={`showcase-tab-${activeTab}`}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center transition-opacity duration-250 ease-out ${
          isAnimating ? "opacity-30" : "opacity-100"
        }`}
      >
        {/* Mobile: Image first; Desktop: Text column first */}
        <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center">
          <h3 className="text-[30px] sm:text-[36px] lg:text-[42px] font-serif leading-[1.1] text-text_primary tracking-tight font-normal">
            <span>{currentTab.headline_line1}</span>
            <br />
            <span className="italic">{currentTab.headline_line2}</span>
          </h3>

          <div className="mt-8 flex flex-col gap-6">
            {currentTab.features.map((feat, idx) => {
              const FeatIcon = featureIcons[idx] || Eye;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-[10px] border border-border bg-white flex items-center justify-center text-sage_600 flex-shrink-0 shadow-sm">
                    <FeatIcon size={16} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-text_primary leading-snug">
                      {feat.title}
                    </h4>
                    <p className="mt-1 text-[13px] leading-[1.6] text-text_secondary">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <button className="w-full py-3.5 rounded-pill bg-wide-btn text-white text-[13px] font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95">
              {currentTab.cta}
            </button>
          </div>
        </div>

        {/* Right Column: 4:3 Image with 2 Floating Glass Chips & Vertical Connector */}
        <div className="order-1 lg:order-2 lg:col-span-7 relative">
          <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden border border-border/80 shadow-card">
            <Image
              src={currentTab.image.src}
              alt={currentTab.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 680px"
              priority
            />

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Connecting line between chip 1 and chip 2 */}
            <div className="absolute top-[32%] left-[30%] w-[1.5px] h-[36%] bg-white/70 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-white absolute -top-1 -left-[3px] shadow" />
              <div className="w-2 h-2 rounded-full bg-white absolute -bottom-1 -left-[3px] shadow" />
            </div>

            {/* Chip 1 (Upper-left of center) */}
            <div className="absolute top-[20%] left-[10%] sm:left-[14%] bg-white/85 backdrop-blur-[10px] rounded-[12px] p-2 sm:p-2.5 shadow-chip border border-white/60 flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sage_50 border border-sage_200 text-sage_700 flex items-center justify-center flex-shrink-0">
                <BedDouble size={14} />
              </div>
              <span className="text-[11px] sm:text-[12px] font-medium text-text_primary whitespace-nowrap">
                {currentTab.chip1.label}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-text_primary text-[11px] font-semibold border border-border/40 shadow-xs">
                {currentTab.chip1.value}
              </span>
            </div>

            {/* Chip 2 (Lower-right of center) */}
            <div className="absolute bottom-[20%] right-[10%] sm:right-[14%] bg-white/85 backdrop-blur-[10px] rounded-[12px] p-2 sm:p-2.5 shadow-chip border border-white/60 flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sage_50 border border-sage_200 text-sage_700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span className="text-[11px] sm:text-[12px] font-medium text-text_primary whitespace-nowrap">
                {currentTab.chip2.label}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-text_primary text-[11px] font-semibold border border-border/40 shadow-xs">
                {currentTab.chip2.value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
