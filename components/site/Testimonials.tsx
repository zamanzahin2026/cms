import React from "react";
import Image from "next/image";
import { TestimonialsSchema } from "@/lib/content-schema";
import { z } from "zod";

type TestimonialsProps = z.infer<typeof TestimonialsSchema>;

export function Testimonials({
  headline_plain,
  headline_italic,
  subtitle,
  items,
}: TestimonialsProps) {
  // Asymmetric columns:
  // Column 1: items[0] and items[3]
  // Column 2: items[1] and items[5]
  // Column 3: items[2] and items[4]
  const col1 = [items[0], items[3]];
  const col2 = [items[1], items[5]];
  const col3 = [items[2], items[4]];

  const renderCard = (item: (typeof items)[0], idx: number) => (
    <div
      key={idx}
      className="bg-surface_muted rounded-[18px] p-6 border border-border/80 flex flex-col justify-between card-hover-lift"
    >
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border/60 flex-shrink-0">
          <Image
            src={item.avatar.src}
            alt={item.avatar.alt}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-text_primary leading-tight">
            {item.name}
          </span>
          <span className="text-[12px] text-text_muted leading-tight mt-0.5">
            {item.role}
          </span>
        </div>
      </div>
      <p className="text-[14px] leading-[1.6] text-text_secondary">
        &ldquo;{item.quote}&rdquo;
      </p>
    </div>
  );

  return (
    <section id="stories" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto">
      {/* Centred Section Header */}
      <div className="text-center max-w-[560px] mx-auto mb-16">
        <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-serif leading-[1.1] tracking-[-0.015em] text-text_primary font-normal">
          <span>{headline_plain} </span>
          <span className="italic">{headline_italic}</span>
        </h2>
        <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.6] text-text_secondary max-w-[520px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* 3-Column Masonry (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) */}
      <div className="hidden lg:grid grid-cols-3 gap-5 items-start">
        <div className="flex flex-col gap-5">{col1.map((item, i) => renderCard(item, i))}</div>
        <div className="flex flex-col gap-5">{col2.map((item, i) => renderCard(item, i))}</div>
        <div className="flex flex-col gap-5">{col3.map((item, i) => renderCard(item, i))}</div>
      </div>

      {/* Tablet: 2 Columns */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-5 items-start">
        <div className="flex flex-col gap-5">
          {renderCard(items[0], 0)}
          {renderCard(items[2], 2)}
          {renderCard(items[4], 4)}
        </div>
        <div className="flex flex-col gap-5">
          {renderCard(items[1], 1)}
          {renderCard(items[3], 3)}
          {renderCard(items[5], 5)}
        </div>
      </div>

      {/* Mobile: 1 Column */}
      <div className="grid sm:hidden grid-cols-1 gap-5">
        {items.map((item, idx) => renderCard(item, idx))}
      </div>
    </section>
  );
}
