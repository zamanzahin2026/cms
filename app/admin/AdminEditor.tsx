"use client";

import React, { useState, useEffect } from "react";
import { SiteContent } from "@/lib/content-schema";
import { AdminShell } from "@/components/admin/AdminShell";
import { TextField } from "@/components/admin/TextField";
import { ImageField } from "@/components/admin/ImageField";
import { HistoryPanel } from "@/components/admin/HistoryPanel";

interface AdminEditorProps {
  initialContent: SiteContent;
  defaultContent: SiteContent;
}

export default function AdminEditor({
  initialContent,
  defaultContent,
}: AdminEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [savedContent, setSavedContent] = useState<SiteContent>(initialContent);
  const [currentSection, setCurrentSection] = useState<string>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // History state
  const [historyVersions, setHistoryVersions] = useState<{ id: number; saved_at: string }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Check unsaved changes
  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(savedContent);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch history when section is history
  useEffect(() => {
    if (currentSection === "history") {
      setLoadingHistory(true);
      fetch("/api/admin/history")
        .then((res) => res.json())
        .then((data) => {
          if (data.versions) {
            setHistoryVersions(data.versions);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingHistory(false));
    }
  }, [currentSection]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save content");
      }

      setSavedContent(content);
      showToast("Changes saved successfully! Public site is updated.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Discard all unsaved edits?")) {
      setContent(savedContent);
      showToast("Unsaved changes discarded.", "success");
    }
  };

  const handleRestoreVersion = async (versionId: number) => {
    try {
      const res = await fetch("/api/admin/history/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to restore version");
      }
      setContent(data.content);
      setSavedContent(data.content);
      showToast(`Restored version #${versionId} successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to restore version", "error");
    }
  };

  // Deep update helper
  const updateContent = (path: (string | number)[], value: any) => {
    setContent((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current: any = copy;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return copy;
    });
  };

  return (
    <AdminShell
      currentSection={currentSection}
      onSelectSection={setCurrentSection}
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      onDiscard={handleDiscard}
      isSaving={isSaving}
      toast={toast}
    >
      <div className="bg-white rounded-card border border-border p-6 sm:p-8 shadow-xs">
        {/* ================= 1. SEO ================= */}
        {currentSection === "seo" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                SEO & Meta Configuration
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Customize search engine metadata, browser title, and OpenGraph tags.
              </p>
            </div>

            <TextField
              id="seo.title"
              label="Page Title (SEO)"
              value={content.seo.title}
              maxLength={140}
              onChange={(val) => updateContent(["seo", "title"], val)}
            />

            <TextField
              id="seo.description"
              label="Meta Description (SEO)"
              value={content.seo.description}
              maxLength={700}
              type="textarea"
              onChange={(val) => updateContent(["seo", "description"], val)}
            />
          </div>
        )}

        {/* ================= 2. HERO ================= */}
        {currentSection === "hero" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                Header & Hero Section
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Edit brand wordmark, navigation links, headline, and primary call to action.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="hero.logo"
                label="Brand Logo Wordmark"
                value={content.hero.logo}
                maxLength={80}
                onChange={(val) => updateContent(["hero", "logo"], val)}
              />
              <TextField
                id="hero.nav_cta"
                label="Header Nav Button CTA"
                value={content.hero.nav_cta}
                maxLength={80}
                onChange={(val) => updateContent(["hero", "nav_cta"], val)}
              />
            </div>

            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Navigation Links (Targets fixed in code)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {content.hero.nav_links.map((link, idx) => (
                  <TextField
                    key={idx}
                    id={`hero.nav_links.${idx}`}
                    label={`Nav Link ${idx + 1}`}
                    value={link}
                    maxLength={80}
                    onChange={(val) => {
                      const newLinks = [...content.hero.nav_links];
                      newLinks[idx] = val;
                      updateContent(["hero", "nav_links"], newLinks);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border/60 pt-4 flex flex-col gap-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block">
                Hero Headlines
              </span>

              <TextField
                id="hero.headline_line1"
                label="Headline — Line 1"
                value={content.hero.headline_line1}
                maxLength={140}
                onChange={(val) => updateContent(["hero", "headline_line1"], val)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  id="hero.headline_line2_plain"
                  label="Headline — Line 2 (Plain word)"
                  value={content.hero.headline_line2_plain}
                  maxLength={140}
                  onChange={(val) => updateContent(["hero", "headline_line2_plain"], val)}
                />
                <TextField
                  id="hero.headline_line2_italic"
                  label="Headline — Line 2 (Italic phrase)"
                  value={content.hero.headline_line2_italic}
                  maxLength={140}
                  onChange={(val) => updateContent(["hero", "headline_line2_italic"], val)}
                />
              </div>

              <TextField
                id="hero.subtitle"
                label="Hero Subtitle"
                value={content.hero.subtitle}
                maxLength={700}
                type="textarea"
                onChange={(val) => updateContent(["hero", "subtitle"], val)}
              />

              <TextField
                id="hero.cta"
                label="Primary Hero CTA Button"
                value={content.hero.cta}
                maxLength={80}
                onChange={(val) => updateContent(["hero", "cta"], val)}
              />
            </div>
          </div>
        )}

        {/* ================= 3. DASHBOARD MOCKUP ================= */}
        {currentSection === "hero_dashboard" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                Hero Console Mockup
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Customize cabin feature image, stat values, status items, and operations progress numbers.
              </p>
            </div>

            {/* Feature Cabin Image */}
            <ImageField
              id="hero_dashboard.image"
              label="Feature Cabin Image (Left Card)"
              value={content.hero_dashboard.image}
              defaultValue={defaultContent.hero_dashboard.image}
              recommendedSize="960x1280 (3:4 portrait)"
              onChange={(val) => updateContent(["hero_dashboard", "image"], val)}
              onToast={showToast}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="hero_dashboard.image_card_title"
                label="Image Card Title"
                value={content.hero_dashboard.image_card_title}
                maxLength={140}
                onChange={(val) => updateContent(["hero_dashboard", "image_card_title"], val)}
              />
              <TextField
                id="hero_dashboard.image_card_caption"
                label="Image Card Caption"
                value={content.hero_dashboard.image_card_caption}
                maxLength={140}
                onChange={(val) => updateContent(["hero_dashboard", "image_card_caption"], val)}
              />
            </div>

            {/* Mockup Tabs */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Console Segmented Tabs
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {content.hero_dashboard.tabs.map((tab, idx) => (
                  <TextField
                    key={idx}
                    id={`hero_dashboard.tabs.${idx}`}
                    label={`Tab ${idx + 1}`}
                    value={tab}
                    maxLength={80}
                    onChange={(val) => {
                      const newTabs = [...content.hero_dashboard.tabs];
                      newTabs[idx] = val;
                      updateContent(["hero_dashboard", "tabs"], newTabs);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Revenue Chart Titles & Legend */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Revenue Trend Card
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  id="hero_dashboard.revenue_title"
                  label="Revenue Chart Title"
                  value={content.hero_dashboard.revenue_title}
                  maxLength={140}
                  onChange={(val) => updateContent(["hero_dashboard", "revenue_title"], val)}
                />
                <TextField
                  id="hero_dashboard.period_label"
                  label="Period Dropdown Label"
                  value={content.hero_dashboard.period_label}
                  maxLength={80}
                  onChange={(val) => updateContent(["hero_dashboard", "period_label"], val)}
                />
                <TextField
                  id="hero_dashboard.legend_revenue"
                  label="Revenue Legend Label"
                  value={content.hero_dashboard.legend_revenue}
                  maxLength={80}
                  onChange={(val) => updateContent(["hero_dashboard", "legend_revenue"], val)}
                />
                <TextField
                  id="hero_dashboard.legend_bookings"
                  label="Bookings Legend Label"
                  value={content.hero_dashboard.legend_bookings}
                  maxLength={80}
                  onChange={(val) => updateContent(["hero_dashboard", "legend_bookings"], val)}
                />
              </div>
            </div>

            {/* Stat Cards */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Middle Stat Cards
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.hero_dashboard.stat_cards.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border bg-surface_muted/50 flex flex-col gap-2">
                    <TextField
                      id={`hero_dashboard.stat_cards.${idx}.label`}
                      label={`Stat ${idx + 1} Label`}
                      value={stat.label}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.hero_dashboard.stat_cards];
                        copy[idx] = { ...copy[idx], label: val };
                        updateContent(["hero_dashboard", "stat_cards"], copy);
                      }}
                    />
                    <TextField
                      id={`hero_dashboard.stat_cards.${idx}.value`}
                      label={`Stat ${idx + 1} Value`}
                      value={stat.value}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.hero_dashboard.stat_cards];
                        copy[idx] = { ...copy[idx], value: val };
                        updateContent(["hero_dashboard", "stat_cards"], copy);
                      }}
                    />
                    <TextField
                      id={`hero_dashboard.stat_cards.${idx}.sub`}
                      label={`Stat ${idx + 1} Subtitle`}
                      value={stat.sub}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.hero_dashboard.stat_cards];
                        copy[idx] = { ...copy[idx], sub: val };
                        updateContent(["hero_dashboard", "stat_cards"], copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy Rate Gauge */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Occupancy Gauge & Trend
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextField
                  id="hero_dashboard.occupancy_title"
                  label="Gauge Title"
                  value={content.hero_dashboard.occupancy_title}
                  maxLength={140}
                  onChange={(val) => updateContent(["hero_dashboard", "occupancy_title"], val)}
                />
                <TextField
                  id="hero_dashboard.occupancy_value"
                  label="Occupancy Percentage"
                  value={content.hero_dashboard.occupancy_value}
                  maxLength={80}
                  onChange={(val) => updateContent(["hero_dashboard", "occupancy_value"], val)}
                />
                <TextField
                  id="hero_dashboard.occupancy_delta"
                  label="Delta Description"
                  value={content.hero_dashboard.occupancy_delta}
                  maxLength={80}
                  onChange={(val) => updateContent(["hero_dashboard", "occupancy_delta"], val)}
                />
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {content.hero_dashboard.mini_stats.map((mStat, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border bg-surface_muted/40">
                    <TextField
                      id={`hero_dashboard.mini_stats.${idx}.label`}
                      label={`Mini Stat ${idx + 1} Label`}
                      value={mStat.label}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.hero_dashboard.mini_stats];
                        copy[idx] = { ...copy[idx], label: val };
                        updateContent(["hero_dashboard", "mini_stats"], copy);
                      }}
                    />
                    <TextField
                      id={`hero_dashboard.mini_stats.${idx}.value`}
                      label={`Mini Stat ${idx + 1} Value`}
                      value={mStat.value}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.hero_dashboard.mini_stats];
                        copy[idx] = { ...copy[idx], value: val };
                        updateContent(["hero_dashboard", "mini_stats"], copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Status Rows */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Status Card Rows
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.hero_dashboard.status_rows.map((row, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border flex gap-2">
                    <div className="flex-1">
                      <TextField
                        id={`hero_dashboard.status_rows.${idx}.label`}
                        label={`Row ${idx + 1} Label`}
                        value={row.label}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.hero_dashboard.status_rows];
                          copy[idx] = { ...copy[idx], label: val };
                          updateContent(["hero_dashboard", "status_rows"], copy);
                        }}
                      />
                    </div>
                    <div className="w-32">
                      <TextField
                        id={`hero_dashboard.status_rows.${idx}.value`}
                        label="Value"
                        value={row.value}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.hero_dashboard.status_rows];
                          copy[idx] = { ...copy[idx], value: val };
                          updateContent(["hero_dashboard", "status_rows"], copy);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Overview Rows */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-2">
                Operations Overview Progress Bars
              </span>
              <div className="flex flex-col gap-3">
                {content.hero_dashboard.ops_rows.map((row, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border flex items-center gap-3">
                    <div className="flex-1">
                      <TextField
                        id={`hero_dashboard.ops_rows.${idx}.label`}
                        label={`Item ${idx + 1} Label`}
                        value={row.label}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.hero_dashboard.ops_rows];
                          copy[idx] = { ...copy[idx], label: val };
                          updateContent(["hero_dashboard", "ops_rows"], copy);
                        }}
                      />
                    </div>
                    <div className="w-28">
                      <TextField
                        id={`hero_dashboard.ops_rows.${idx}.value`}
                        label="Percentage"
                        value={row.value}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.hero_dashboard.ops_rows];
                          copy[idx] = { ...copy[idx], value: val };
                          updateContent(["hero_dashboard", "ops_rows"], copy);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. FEATURES ================= */}
        {currentSection === "features" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                Features Section
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Edit headlines and 3 core feature cards (Calendar, Review, Team Tasks).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="features.headline_plain"
                label="Headline (Plain text)"
                value={content.features.headline_plain}
                maxLength={140}
                onChange={(val) => updateContent(["features", "headline_plain"], val)}
              />
              <TextField
                id="features.headline_italic"
                label="Headline (Italic phrase)"
                value={content.features.headline_italic}
                maxLength={140}
                onChange={(val) => updateContent(["features", "headline_italic"], val)}
              />
            </div>

            <TextField
              id="features.subtitle"
              label="Section Subtitle"
              value={content.features.subtitle}
              maxLength={700}
              type="textarea"
              onChange={(val) => updateContent(["features", "subtitle"], val)}
            />

            {/* Card 1 */}
            <div className="border-t border-border/60 pt-4">
              <h3 className="text-[15px] font-semibold text-text_primary mb-2">
                Card 1: Reservation Calendar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  id="features.cards.0.title"
                  label="Title"
                  value={content.features.cards[0].title}
                  maxLength={140}
                  onChange={(val) => updateContent(["features", "cards", 0, "title"], val)}
                />
                <TextField
                  id="features.cards.0.description"
                  label="Description"
                  value={content.features.cards[0].description}
                  maxLength={700}
                  type="textarea"
                  onChange={(val) => updateContent(["features", "cards", 0, "description"], val)}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="border-t border-border/60 pt-4">
              <h3 className="text-[15px] font-semibold text-text_primary mb-2">
                Card 2: Available Properties & Review
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <TextField
                  id="features.cards.1.title"
                  label="Title"
                  value={content.features.cards[1].title}
                  maxLength={140}
                  onChange={(val) => updateContent(["features", "cards", 1, "title"], val)}
                />
                <TextField
                  id="features.cards.1.description"
                  label="Description"
                  value={content.features.cards[1].description}
                  maxLength={700}
                  type="textarea"
                  onChange={(val) => updateContent(["features", "cards", 1, "description"], val)}
                />
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface_muted/50 flex flex-col gap-3">
                <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider">
                  Review Preview Card
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    id="features.cards.1.review.rating"
                    label="Rating Score"
                    value={content.features.cards[1].review.rating}
                    maxLength={80}
                    onChange={(val) => updateContent(["features", "cards", 1, "review", "rating"], val)}
                  />
                  <TextField
                    id="features.cards.1.review.rating_caption"
                    label="Rating Caption"
                    value={content.features.cards[1].review.rating_caption}
                    maxLength={80}
                    onChange={(val) => updateContent(["features", "cards", 1, "review", "rating_caption"], val)}
                  />
                  <TextField
                    id="features.cards.1.review.reviewer_name"
                    label="Reviewer Name"
                    value={content.features.cards[1].review.reviewer_name}
                    maxLength={80}
                    onChange={(val) => updateContent(["features", "cards", 1, "review", "reviewer_name"], val)}
                  />
                  <TextField
                    id="features.cards.1.review.reviewer_meta"
                    label="Reviewer Meta"
                    value={content.features.cards[1].review.reviewer_meta}
                    maxLength={140}
                    onChange={(val) => updateContent(["features", "cards", 1, "review", "reviewer_meta"], val)}
                  />
                </div>
                <TextField
                  id="features.cards.1.review.review_text"
                  label="Review Text"
                  value={content.features.cards[1].review.review_text}
                  maxLength={700}
                  type="textarea"
                  onChange={(val) => updateContent(["features", "cards", 1, "review", "review_text"], val)}
                />
                <ImageField
                  id="features.cards.1.review.avatar"
                  label="Reviewer Avatar (Sarah)"
                  value={content.features.cards[1].review.avatar}
                  defaultValue={defaultContent.features.cards[1].review.avatar}
                  recommendedSize="512x512 (1:1)"
                  onChange={(val) => updateContent(["features", "cards", 1, "review", "avatar"], val)}
                  onToast={showToast}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="border-t border-border/60 pt-4">
              <h3 className="text-[15px] font-semibold text-text_primary mb-2">
                Card 3: Team Tasks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <TextField
                  id="features.cards.2.title"
                  label="Title"
                  value={content.features.cards[2].title}
                  maxLength={140}
                  onChange={(val) => updateContent(["features", "cards", 2, "title"], val)}
                />
                <TextField
                  id="features.cards.2.description"
                  label="Description"
                  value={content.features.cards[2].description}
                  maxLength={700}
                  type="textarea"
                  onChange={(val) => updateContent(["features", "cards", 2, "description"], val)}
                />
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface_muted/50 flex flex-col gap-3">
                <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider">
                  Task Labels & Progress (Check states are fixed in code)
                </span>
                {content.features.cards[2].tasks.map((task, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-1">
                      <TextField
                        id={`features.cards.2.tasks.${idx}.label`}
                        label={`Task ${idx + 1}`}
                        value={task.label}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.features.cards[2].tasks];
                          copy[idx] = { ...copy[idx], label: val };
                          updateContent(["features", "cards", 2, "tasks"], copy);
                        }}
                      />
                    </div>
                    <div className="w-28">
                      <TextField
                        id={`features.cards.2.tasks.${idx}.progress`}
                        label="Progress"
                        value={task.progress}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.features.cards[2].tasks];
                          copy[idx] = { ...copy[idx], progress: val };
                          updateContent(["features", "cards", 2, "tasks"], copy);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <TextField
                    id="features.cards.2.summary_title"
                    label="Summary Title"
                    value={content.features.cards[2].summary_title}
                    maxLength={140}
                    onChange={(val) => updateContent(["features", "cards", 2, "summary_title"], val)}
                  />
                  <TextField
                    id="features.cards.2.summary_sub"
                    label="Summary Subtitle"
                    value={content.features.cards[2].summary_sub}
                    maxLength={140}
                    onChange={(val) => updateContent(["features", "cards", 2, "summary_sub"], val)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. SHOWCASE TABS ================= */}
        {(currentSection === "showcase" || currentSection.startsWith("showcase-tab-")) && (
          <div className="flex flex-col gap-6">
            {(() => {
              const tabIndex = currentSection.startsWith("showcase-tab-")
                ? parseInt(currentSection.replace("showcase-tab-", ""), 10)
                : 0;
              const tab = content.showcase.tabs[tabIndex];
              const defaultTab = defaultContent.showcase.tabs[tabIndex];

              return (
                <div key={tabIndex} className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-serif text-text_primary font-normal">
                      Showcase: Tab {tabIndex + 1} ({tab.tab_label})
                    </h2>
                    <p className="text-[13px] text-text_secondary mt-1">
                      Edit tab label, headline, feature items, button copy, image, and glass chip labels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextField
                      id={`showcase.tabs.${tabIndex}.tab_label`}
                      label="Tab Navigation Label"
                      value={tab.tab_label}
                      maxLength={80}
                      onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "tab_label"], val)}
                    />
                    <TextField
                      id={`showcase.tabs.${tabIndex}.headline_line1`}
                      label="Headline — Line 1"
                      value={tab.headline_line1}
                      maxLength={140}
                      onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "headline_line1"], val)}
                    />
                    <TextField
                      id={`showcase.tabs.${tabIndex}.headline_line2`}
                      label="Headline — Line 2 (Italic)"
                      value={tab.headline_line2}
                      maxLength={140}
                      onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "headline_line2"], val)}
                    />
                  </div>

                  <TextField
                    id={`showcase.tabs.${tabIndex}.cta`}
                    label="Call to Action Button"
                    value={tab.cta}
                    maxLength={80}
                    onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "cta"], val)}
                  />

                  {/* Image & Chips */}
                  <div className="border-t border-border/60 pt-4">
                    <ImageField
                      id={`showcase.tabs.${tabIndex}.image`}
                      label={`Tab ${tabIndex + 1} Showcase Image`}
                      value={tab.image}
                      defaultValue={defaultTab.image}
                      recommendedSize="1600x1200 (4:3)"
                      onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "image"], val)}
                      onToast={showToast}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div className="p-3 rounded-lg border border-border bg-surface_muted/40">
                        <span className="text-[11px] font-semibold text-text_muted uppercase tracking-wider block mb-1">
                          Glass Chip 1 (Top-Left)
                        </span>
                        <div className="flex gap-2">
                          <TextField
                            id={`showcase.tabs.${tabIndex}.chip1.label`}
                            label="Label"
                            value={tab.chip1.label}
                            maxLength={80}
                            onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "chip1", "label"], val)}
                          />
                          <TextField
                            id={`showcase.tabs.${tabIndex}.chip1.value`}
                            label="Value"
                            value={tab.chip1.value}
                            maxLength={80}
                            onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "chip1", "value"], val)}
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-border bg-surface_muted/40">
                        <span className="text-[11px] font-semibold text-text_muted uppercase tracking-wider block mb-1">
                          Glass Chip 2 (Bottom-Right)
                        </span>
                        <div className="flex gap-2">
                          <TextField
                            id={`showcase.tabs.${tabIndex}.chip2.label`}
                            label="Label"
                            value={tab.chip2.label}
                            maxLength={80}
                            onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "chip2", "label"], val)}
                          />
                          <TextField
                            id={`showcase.tabs.${tabIndex}.chip2.value`}
                            label="Value"
                            value={tab.chip2.value}
                            maxLength={80}
                            onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "chip2", "value"], val)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Feature Rows */}
                  <div className="border-t border-border/60 pt-4 flex flex-col gap-4">
                    <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block">
                      3 Feature Row Descriptions
                    </span>
                    {tab.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-4 rounded-xl border border-border bg-surface_muted/30">
                        <TextField
                          id={`showcase.tabs.${tabIndex}.features.${fIdx}.title`}
                          label={`Feature ${fIdx + 1} Title`}
                          value={feat.title}
                          maxLength={140}
                          onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "features", fIdx, "title"], val)}
                        />
                        <TextField
                          id={`showcase.tabs.${tabIndex}.features.${fIdx}.description`}
                          label={`Feature ${fIdx + 1} Description`}
                          value={feat.description}
                          maxLength={700}
                          type="textarea"
                          onChange={(val) => updateContent(["showcase", "tabs", tabIndex, "features", fIdx, "description"], val)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= 6. TESTIMONIALS ================= */}
        {currentSection === "testimonials" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                Testimonials Section
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Edit section titles and all 6 client testimonials with their photo avatars.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="testimonials.headline_plain"
                label="Headline (Plain text)"
                value={content.testimonials.headline_plain}
                maxLength={140}
                onChange={(val) => updateContent(["testimonials", "headline_plain"], val)}
              />
              <TextField
                id="testimonials.headline_italic"
                label="Headline (Italic brand)"
                value={content.testimonials.headline_italic}
                maxLength={140}
                onChange={(val) => updateContent(["testimonials", "headline_italic"], val)}
              />
            </div>

            <TextField
              id="testimonials.subtitle"
              label="Subtitle"
              value={content.testimonials.subtitle}
              maxLength={700}
              type="textarea"
              onChange={(val) => updateContent(["testimonials", "subtitle"], val)}
            />

            <div className="border-t border-border/60 pt-4 flex flex-col gap-6">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block">
                6 Testimonial Cards
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {content.testimonials.items.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-surface_muted/40 flex flex-col gap-3">
                    <span className="text-[12px] font-semibold text-text_primary">
                      Testimonial #{idx + 1}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        id={`testimonials.items.${idx}.name`}
                        label="Name"
                        value={item.name}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.testimonials.items];
                          copy[idx] = { ...copy[idx], name: val };
                          updateContent(["testimonials", "items"], copy);
                        }}
                      />
                      <TextField
                        id={`testimonials.items.${idx}.role`}
                        label="Role / Title"
                        value={item.role}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.testimonials.items];
                          copy[idx] = { ...copy[idx], role: val };
                          updateContent(["testimonials", "items"], copy);
                        }}
                      />
                    </div>

                    <TextField
                      id={`testimonials.items.${idx}.quote`}
                      label="Quote"
                      value={item.quote}
                      maxLength={700}
                      type="textarea"
                      onChange={(val) => {
                        const copy = [...content.testimonials.items];
                        copy[idx] = { ...copy[idx], quote: val };
                        updateContent(["testimonials", "items"], copy);
                      }}
                    />

                    <ImageField
                      id={`testimonials.items.${idx}.avatar`}
                      label={`Avatar Photo (${item.name})`}
                      value={item.avatar}
                      defaultValue={defaultContent.testimonials.items[idx].avatar}
                      recommendedSize="512x512 (1:1)"
                      onChange={(val) => {
                        const copy = [...content.testimonials.items];
                        copy[idx] = { ...copy[idx], avatar: val };
                        updateContent(["testimonials", "items"], copy);
                      }}
                      onToast={showToast}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. FOOTER ================= */}
        {currentSection === "footer" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-serif text-text_primary font-normal">
                Footer Section
              </h2>
              <p className="text-[13px] text-text_secondary mt-1">
                Customize brand tagline, column titles, link labels, and social profile links.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="footer.logo"
                label="Footer Wordmark"
                value={content.footer.logo}
                maxLength={80}
                onChange={(val) => updateContent(["footer", "logo"], val)}
              />
              <TextField
                id="footer.copyright"
                label="Copyright Notice"
                value={content.footer.copyright}
                maxLength={140}
                onChange={(val) => updateContent(["footer", "copyright"], val)}
              />
            </div>

            <TextField
              id="footer.tagline"
              label="Tagline"
              value={content.footer.tagline}
              maxLength={700}
              type="textarea"
              onChange={(val) => updateContent(["footer", "tagline"], val)}
            />

            {/* 3 Link Columns */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-3">
                Link Columns
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {content.footer.columns.map((col, cIdx) => (
                  <div key={cIdx} className="p-3.5 rounded-xl border border-border bg-surface_muted/40 flex flex-col gap-2">
                    <TextField
                      id={`footer.columns.${cIdx}.heading`}
                      label={`Column ${cIdx + 1} Heading`}
                      value={col.heading}
                      maxLength={80}
                      onChange={(val) => {
                        const copy = [...content.footer.columns];
                        copy[cIdx] = { ...copy[cIdx], heading: val };
                        updateContent(["footer", "columns"], copy);
                      }}
                    />

                    {col.links.map((link, lIdx) => (
                      <TextField
                        key={lIdx}
                        id={`footer.columns.${cIdx}.links.${lIdx}`}
                        label={`Link ${lIdx + 1}`}
                        value={link}
                        maxLength={80}
                        onChange={(val) => {
                          const copy = [...content.footer.columns];
                          const newLinks = [...copy[cIdx].links];
                          newLinks[lIdx] = val;
                          copy[cIdx] = { ...copy[cIdx], links: newLinks as any };
                          updateContent(["footer", "columns"], copy);
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Socials & Legal */}
            <div className="border-t border-border/60 pt-4">
              <span className="text-[12px] font-semibold text-text_muted uppercase tracking-wider block mb-3">
                Social Profile Links (Must start with https:// or '#')
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.footer.socials.map((soc, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-lg border border-border bg-surface_muted/30">
                    <span className="text-[12px] font-semibold text-text_primary block mb-1">
                      {soc.platform}
                    </span>
                    <TextField
                      id={`footer.socials.${sIdx}.url`}
                      label="Profile URL"
                      value={soc.url}
                      type="url"
                      maxLength={200}
                      onChange={(val) => {
                        const copy = [...content.footer.socials];
                        copy[sIdx] = { ...copy[sIdx], url: val };
                        updateContent(["footer", "socials"], copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. HISTORY ================= */}
        {currentSection === "history" && (
          <HistoryPanel
            versions={historyVersions}
            onRestore={handleRestoreVersion}
            isLoading={loadingHistory}
          />
        )}
      </div>
    </AdminShell>
  );
}
