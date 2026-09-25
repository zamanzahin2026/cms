import React from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Home as HomeIcon,
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Star,
  ChevronRight,
} from "lucide-react";
import { FeaturesSchema } from "@/lib/content-schema";
import { z } from "zod";

type FeaturesProps = z.infer<typeof FeaturesSchema>;

export function Features({
  headline_plain,
  headline_italic,
  subtitle,
  cards,
}: FeaturesProps) {
  const card1 = cards[0];
  const card2 = cards[1];
  const card3 = cards[2];

  // Calendar Preview Matrix (Sun - Sat)
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const days = [
    { num: 27, prev: true },
    { num: 28, prev: true },
    { num: 29, prev: true },
    { num: 30, prev: true },
    { num: 31, prev: true },
    { num: 1, current: true },
    { num: 2, current: true, singleRange: true },
    { num: 3, current: true },
    { num: 4, current: true },
    { num: 5, current: true },
    { num: 6, current: true, rangeStart: true },
    { num: 7, current: true, inRange: true },
    { num: 8, current: true, rangeEnd: true },
    { num: 9, current: true },
    { num: 10, current: true },
    { num: 11, current: true },
    { num: 12, current: true },
    { num: 13, current: true },
    { num: 14, current: true, selected: true },
    { num: 15, current: true },
    { num: 16, current: true },
    { num: 17, current: true },
    { num: 18, current: true },
    { num: 19, current: true },
    { num: 20, current: true },
    { num: 21, current: true },
    { num: 22, current: true, rangeStart: true },
    { num: 23, current: true, inRange: true },
    { num: 24, current: true, rangeEnd: true },
    { num: 25, current: true },
    { num: 26, current: true },
    { num: 27, current: true },
    { num: 28, current: true },
  ];

  return (
    <section id="features" className="pt-48 sm:pt-64 pb-20 sm:pb-28 px-4 sm:px-8 max-w-[1200px] mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-[640px] mx-auto mb-16">
        <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-serif leading-[1.1] tracking-[-0.015em] text-text_primary font-normal">
          <span>{headline_plain} </span>
          <span className="italic">{headline_italic}</span>
        </h2>
        <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.6] text-text_secondary max-w-[560px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* 3 Equal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ================= CARD 1: Reservation Calendar ================= */}
        <div className="bg-surface_muted rounded-card p-3 border border-border/80 flex flex-col card-hover-lift">
          {/* Inner Preview Panel */}
          <div className="bg-white rounded-inner h-[210px] p-3 flex flex-col justify-center border border-border/50">
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {weekdays.map((w, idx) => (
                <span key={idx} className="text-[10px] text-text_muted font-medium">
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5 text-center items-center">
              {days.map((d, idx) => {
                let cellStyle = "text-[11px] h-6 flex items-center justify-center font-medium transition-colors";
                if (d.prev) {
                  cellStyle += " text-text_muted/40";
                } else if (d.selected) {
                  cellStyle += " bg-sage_600 text-white rounded-full font-semibold shadow-sm";
                } else if (d.singleRange) {
                  cellStyle += " bg-sage_100 text-sage_700 rounded-full font-semibold";
                } else if (d.rangeStart) {
                  cellStyle += " bg-sage_100 text-sage_700 rounded-l-full font-semibold";
                } else if (d.inRange) {
                  cellStyle += " bg-sage_100 text-sage_700 font-semibold";
                } else if (d.rangeEnd) {
                  cellStyle += " bg-sage_100 text-sage_700 rounded-r-full font-semibold";
                } else {
                  cellStyle += " text-text_secondary hover:bg-surface_muted rounded-full";
                }

                return (
                  <div key={idx} className={cellStyle}>
                    {d.num}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-4 pb-2 px-3 text-center flex flex-col items-center">
            <div className="w-full border-t border-dashed border-border mb-4" />
            <div className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-sage_600 mb-2.5">
              <CalendarIcon size={14} />
            </div>
            <h3 className="text-[20px] font-serif text-text_primary font-normal">
              {card1.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-text_secondary max-w-[280px]">
              {card1.description}
            </p>
          </div>
        </div>

        {/* ================= CARD 2: Available Properties (Review) ================= */}
        <div className="bg-surface_muted rounded-card p-3 border border-border/80 flex flex-col card-hover-lift">
          {/* Inner Preview Panel */}
          <div className="bg-white rounded-inner h-[210px] p-3.5 flex flex-col justify-between border border-border/50">
            {/* Top Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif text-text_primary font-normal leading-none">
                  {card2.review.rating}
                </span>
                <div className="flex items-center text-sage_600 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#6F8559" stroke="#6F8559" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-text_muted">
                {card2.review.rating_caption}
              </span>
            </div>

            {/* Inner Review Card */}
            <div className="bg-surface_muted/80 rounded-xl p-2.5 border border-border/60">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src={card2.review.avatar.src}
                    alt={card2.review.avatar.alt}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-text_primary leading-tight">
                    {card2.review.reviewer_name}
                  </span>
                  <span className="text-[10px] text-text_muted leading-tight">
                    {card2.review.reviewer_meta}
                  </span>
                </div>
              </div>
              <p className="text-[11px] leading-[1.4] text-text_secondary line-clamp-3">
                &ldquo;{card2.review.review_text}&rdquo;
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-4 pb-2 px-3 text-center flex flex-col items-center">
            <div className="w-full border-t border-dashed border-border mb-4" />
            <div className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-sage_600 mb-2.5">
              <HomeIcon size={14} />
            </div>
            <h3 className="text-[20px] font-serif text-text_primary font-normal">
              {card2.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-text_secondary max-w-[280px]">
              {card2.description}
            </p>
          </div>
        </div>

        {/* ================= CARD 3: Team Tasks ================= */}
        <div className="bg-surface_muted rounded-card p-3 border border-border/80 flex flex-col card-hover-lift">
          {/* Inner Preview Panel */}
          <div className="bg-white rounded-inner h-[210px] p-3 flex flex-col justify-between border border-border/50">
            {/* Task Checklist Rows */}
            <div className="flex flex-col gap-1.5">
              {card3.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-0.5"
                >
                  <div className="flex items-center gap-1.5 text-text_primary">
                    {task.done ? (
                      <CheckCircle2 size={13} className="text-sage_600 fill-sage_100" />
                    ) : (
                      <Circle size={13} className="text-border" />
                    )}
                    <span className={task.done ? "text-text_secondary line-through" : "text-text_primary"}>
                      {task.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-text_muted font-medium">
                    {task.progress}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Summary Row */}
            <div className="bg-surface_muted rounded-lg p-2 flex items-center justify-between border border-border/50">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-text_primary leading-tight">
                  {card3.summary_title}
                </span>
                <span className="text-[10px] text-text_muted leading-tight">
                  {card3.summary_sub}
                </span>
              </div>
              <ChevronRight size={13} className="text-text_muted" />
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-4 pb-2 px-3 text-center flex flex-col items-center">
            <div className="w-full border-t border-dashed border-border mb-4" />
            <div className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-sage_600 mb-2.5">
              <ClipboardCheck size={14} />
            </div>
            <h3 className="text-[20px] font-serif text-text_primary font-normal">
              {card3.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-text_secondary max-w-[280px]">
              {card3.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
