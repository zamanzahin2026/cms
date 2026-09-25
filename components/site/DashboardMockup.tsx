import React from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  Settings,
  CalendarCheck,
  Sparkles,
  Wifi,
  Wrench,
  Heart,
  Zap,
  CheckCircle2,
  Users,
  AlertCircle,
} from "lucide-react";
import { HeroDashboardSchema } from "@/lib/content-schema";
import { z } from "zod";
import { BarLineChart } from "./charts/BarLineChart";
import { AreaChart } from "./charts/AreaChart";
import { Gauge } from "./charts/Gauge";

type DashboardProps = z.infer<typeof HeroDashboardSchema>;

export function DashboardMockup({
  image,
  tabs,
  image_card_title,
  image_card_caption,
  revenue_title,
  period_label,
  legend_revenue,
  legend_bookings,
  stat_cards,
  trend_title,
  occupancy_title,
  occupancy_value,
  occupancy_label,
  occupancy_delta,
  mini_stats,
  status_title,
  status_badge,
  status_rows,
  ops_title,
  ops_rows,
}: DashboardProps) {
  const statusIcons = [Sparkles, Wifi, CalendarCheck, Wrench];
  const miniStatIcons = [CheckCircle2, Users, AlertCircle];
  const opsIcons = [Sparkles, Heart, Wrench, Bell, Zap];

  return (
    <div className="w-full max-w-[1040px] mx-auto bg-white rounded-[24px] shadow-dashboard p-3 sm:p-5 border border-border/80">
      {/* Top Bar of the Mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        {/* Left: Ostra Wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif tracking-tight text-text_primary">
            Ostra
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-sage_50 text-sage_700 font-medium">
            Console
          </span>
        </div>

        {/* Center: Segmented Pill Tab Group */}
        <div className="hidden sm:flex items-center bg-surface_muted p-1 rounded-pill border border-border/40">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-pill text-[12px] font-medium transition-all ${
                idx === 0
                  ? "bg-white text-text_primary shadow-sm"
                  : "text-text_muted hover:text-text_secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Circular Icon Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            aria-label="Search"
            className="w-7 h-7 rounded-full bg-surface_muted flex items-center justify-center text-text_secondary hover:bg-sage_50 hover:text-text_primary transition-colors"
          >
            <Search size={14} />
          </button>
          <button
            aria-label="Notifications"
            className="w-7 h-7 rounded-full bg-surface_muted flex items-center justify-center text-text_secondary hover:bg-sage_50 hover:text-text_primary transition-colors relative"
          >
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent_coral" />
          </button>
          <button
            aria-label="Settings"
            className="w-7 h-7 rounded-full bg-surface_muted flex items-center justify-center text-text_secondary hover:bg-sage_50 hover:text-text_primary transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Main 3-Column Content Grid (≈28% / 44% / 28%) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4">
        {/* ================= COLUMN 1 (≈28% / col-span-3) ================= */}
        <div className="md:col-span-3 flex flex-col gap-3">
          {/* (a) Tall Hero Cabin Image Card */}
          <div className="relative rounded-[16px] overflow-hidden border border-border h-64 sm:h-72 group">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 280px"
              priority
            />
            {/* Dark top-to-transparent gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-transparent p-4 flex flex-col justify-start">
              <h4 className="text-white font-serif text-[17px] leading-tight drop-shadow-sm font-normal">
                {image_card_title}
              </h4>
              <p className="text-white/80 text-[11px] mt-1 drop-shadow-sm">
                {image_card_caption}
              </p>
            </div>
          </div>

          {/* (b) Status Card (hidden on mobile, shown desktop/tablet) */}
          <div className="hidden md:flex flex-col bg-white rounded-[16px] border border-border p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-text_primary">
                {status_title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sage_100 text-sage_700 font-medium">
                {status_badge}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {status_rows.map((row, idx) => {
                const IconComponent = statusIcons[idx] || Sparkles;
                return (
                  <div key={idx} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 text-text_secondary">
                      <IconComponent size={14} className="text-sage_600" />
                      <span>{row.label}</span>
                    </div>
                    <span className="font-medium text-text_primary">{row.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2 (≈44% / col-span-6) ================= */}
        <div className="md:col-span-6 flex flex-col gap-3">
          {/* (a) Nightly Revenue Trend Card */}
          <div className="bg-white rounded-[16px] border border-border p-3.5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[13px] font-medium text-text_primary">
                {revenue_title}
              </h4>
            </div>
            <BarLineChart
              periodLabel={period_label}
              legendRevenue={legend_revenue}
              legendBookings={legend_bookings}
            />
          </div>

          {/* (b) Two Small Stat Cards Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {stat_cards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[16px] border border-border p-3.5 flex flex-col justify-between"
              >
                <span className="text-[11px] text-text_secondary font-medium">
                  {stat.label}
                </span>
                <div className="my-1">
                  <span className="text-2xl font-serif text-text_primary font-normal">
                    {stat.value}
                  </span>
                </div>
                <span className="text-[10px] text-sage_700 font-medium">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

          {/* (c) Occupancy Trend Area Chart (hidden on mobile) */}
          <div className="hidden md:flex flex-col bg-white rounded-[16px] border border-border p-3.5">
            <h4 className="text-[13px] font-medium text-text_primary mb-2">
              {trend_title}
            </h4>
            <AreaChart />
          </div>
        </div>

        {/* ================= COLUMN 3 (≈28% / col-span-3) ================= */}
        {/* Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden md:flex md:col-span-3 flex-col gap-3">
          {/* (a) Occupancy Rate Semicircle Gauge Card */}
          <div className="bg-white rounded-[16px] border border-border p-3.5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-[13px] font-medium text-text_primary">
                {occupancy_title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface_muted border border-border text-text_secondary font-medium">
                {period_label}
              </span>
            </div>

            <Gauge
              value={occupancy_value}
              label={occupancy_label}
              delta={occupancy_delta}
            />

            {/* Three Mini Stats in a Row */}
            <div className="grid grid-cols-3 gap-1.5 w-full mt-3 pt-3 border-t border-border/60">
              {mini_stats.map((mStat, idx) => {
                const MiniIcon = miniStatIcons[idx] || CheckCircle2;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <MiniIcon size={12} className="text-sage_600 mb-1" />
                    <span className="text-[10px] text-text_muted">{mStat.label}</span>
                    <span className="text-[12px] font-semibold text-text_primary">
                      {mStat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* (b) Operations Overview Progress Bars Card */}
          <div className="bg-white rounded-[16px] border border-border p-3.5 flex flex-col">
            <h4 className="text-[13px] font-medium text-text_primary mb-3">
              {ops_title}
            </h4>

            <div className="flex flex-col gap-3">
              {ops_rows.map((row, idx) => {
                const OpsIcon = opsIcons[idx] || Sparkles;
                const percentage = parseFloat(row.value.replace(/[^0-9.]/g, "")) || 0;
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-text_secondary">
                        <OpsIcon size={12} className="text-sage_600" />
                        <span className="truncate">{row.label}</span>
                      </div>
                      <span className="font-semibold text-text_primary">
                        {row.value}
                      </span>
                    </div>

                    {/* Progress bar whose width equals the percentage */}
                    <div className="w-full h-1.5 bg-surface_muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage_600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
