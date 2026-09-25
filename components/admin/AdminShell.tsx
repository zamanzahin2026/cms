"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Save,
  RotateCcw,
  History,
  User,
  LogOut,
  Search,
  Layout,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

export interface NavGroup {
  id: string;
  label: string;
  icon?: any;
  subItems?: { id: string; label: string }[];
}

interface AdminShellProps {
  currentSection: string;
  onSelectSection: (id: string) => void;
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  isSaving: boolean;
  children: React.ReactNode;
  toast: { text: string; type: "success" | "error" } | null;
}

const NAV_GROUPS: NavGroup[] = [
  { id: "seo", label: "SEO & Meta", icon: Search },
  { id: "hero", label: "Header & Hero", icon: Layout },
  { id: "hero_dashboard", label: "Dashboard Preview", icon: Sliders },
  { id: "features", label: "Features", icon: CheckCircle2 },
  {
    id: "showcase",
    label: "Showcase Tabs",
    icon: Sliders,
    subItems: [
      { id: "showcase-tab-0", label: "1. Reservations" },
      { id: "showcase-tab-1", label: "2. Housekeeping" },
      { id: "showcase-tab-2", label: "3. Operations" },
      { id: "showcase-tab-3", label: "4. Analytics" },
    ],
  },
  { id: "testimonials", label: "Testimonials", icon: User },
  { id: "footer", label: "Footer", icon: Layout },
  { id: "history", label: "Version History", icon: History },
];

export function AdminShell({
  currentSection,
  onSelectSection,
  hasUnsavedChanges,
  onSave,
  onDiscard,
  isSaving,
  children,
  toast,
}: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-sage_200">
      {/* ================= Sticky Top Bar ================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text_secondary hover:bg-surface_muted"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/" className="text-xl font-serif text-text_primary font-normal">
            Ostra <span className="text-[12px] font-sans text-text_muted font-medium ml-1">Admin</span>
          </Link>

          {hasUnsavedChanges && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Top Actions: Discard, Save, View Site */}
        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-pill border border-border text-text_secondary hover:text-text_primary text-[12px] font-medium transition-colors"
            >
              <RotateCcw size={13} />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-pill bg-primary-btn text-white text-[12px] font-medium shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={13} />
            <span>{isSaving ? "Saving..." : "Save changes"}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[12px] text-text_secondary hover:text-text_primary font-medium px-2 py-1 transition-colors"
          >
            <span className="hidden sm:inline">View site</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-[13px] font-medium flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-sage_50 text-sage_900 border-sage_300"
                : "bg-red-50 text-red-900 border-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-sage_700" />
            ) : (
              <AlertCircle size={16} className="text-red-700" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* ================= Main Layout (Sidebar + Content) ================= */}
      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-6 gap-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0">
          <div className="sticky top-20 flex flex-col gap-1 bg-white rounded-card border border-border p-3 shadow-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text_muted px-3 py-1">
              Content Sections
            </span>

            {NAV_GROUPS.map((grp) => {
              const Icon = grp.icon || Layout;
              const isSelected = currentSection === grp.id || (grp.subItems && grp.subItems.some((s) => s.id === currentSection));

              return (
                <div key={grp.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => onSelectSection(grp.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-colors ${
                      isSelected
                        ? "bg-sage_50 text-sage_700 font-semibold"
                        : "text-text_secondary hover:bg-surface_muted hover:text-text_primary"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{grp.label}</span>
                  </button>

                  {/* Sub-items for showcase tabs */}
                  {grp.subItems && (
                    <div className="ml-6 pl-2 border-l border-border/70 flex flex-col gap-0.5 mt-0.5">
                      {grp.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onSelectSection(sub.id)}
                          className={`text-[12px] text-left py-1 px-2 rounded font-medium transition-colors ${
                            currentSection === sub.id
                              ? "text-sage_700 font-semibold bg-sage_50/80"
                              : "text-text_muted hover:text-text_secondary"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="my-2 border-t border-border/60" />

            {/* Account & Sign Out Links */}
            <Link
              href="/admin/account"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-text_secondary hover:bg-surface_muted hover:text-text_primary transition-colors"
            >
              <User size={15} />
              <span>Account</span>
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-border p-4 shadow-lg flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text_muted">
              Jump to Section
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(grp.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-[12px] font-medium text-left ${
                    currentSection === grp.id ? "bg-sage_50 text-sage_700 font-semibold" : "text-text_secondary"
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <Link
                href="/admin/account"
                className="text-[13px] font-medium text-text_secondary flex items-center gap-1.5"
              >
                <User size={14} /> Account Settings
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-[13px] font-medium text-red-600 flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
