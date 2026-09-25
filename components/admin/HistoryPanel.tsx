"use client";

import React, { useState } from "react";
import { History, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";

interface HistoryVersion {
  id: number;
  saved_at: string;
}

interface HistoryPanelProps {
  versions: HistoryVersion[];
  onRestore: (versionId: number) => Promise<void>;
  isLoading?: boolean;
}

export function HistoryPanel({
  versions,
  onRestore,
  isLoading = false,
}: HistoryPanelProps) {
  const [confirmVersionId, setConfirmVersionId] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleConfirmRestore = async (id: number) => {
    try {
      setIsRestoring(true);
      await onRestore(id);
      setConfirmVersionId(null);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <History size={18} className="text-sage_600" />
        <h3 className="text-[16px] font-semibold text-text_primary">
          Saved Version History
        </h3>
      </div>
      <p className="text-[13px] text-text_secondary leading-relaxed">
        The system automatically preserves the last 20 revisions. Restoring a version reverts all site copy and image selections to that point in time.
      </p>

      {versions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-border text-text_muted text-[13px]">
          No previous versions recorded yet. Previous snapshots appear here when you save content changes.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {versions.map((ver) => {
            const date = new Date(ver.saved_at);
            const formatted = date.toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div
                key={ver.id}
                className="bg-white rounded-xl border border-border p-3.5 flex items-center justify-between hover:border-sage_400 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-text_primary">
                    Version #{ver.id}
                  </span>
                  <span className="text-[11px] text-text_muted">{formatted}</span>
                </div>

                {confirmVersionId === ver.id ? (
                  <div className="flex items-center gap-2 animate-fade-up">
                    <span className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                      <AlertTriangle size={12} /> Confirm restore?
                    </span>
                    <button
                      type="button"
                      disabled={isRestoring}
                      onClick={() => handleConfirmRestore(ver.id)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-medium shadow-xs"
                    >
                      {isRestoring ? <Loader2 size={12} className="animate-spin" /> : "Yes, Restore"}
                    </button>
                    <button
                      type="button"
                      disabled={isRestoring}
                      onClick={() => setConfirmVersionId(null)}
                      className="px-2 py-1 rounded border border-border text-text_secondary text-[11px] hover:bg-surface_muted"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmVersionId(ver.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-sage_600 text-text_secondary hover:text-text_primary text-[12px] font-medium transition-all"
                  >
                    <RotateCcw size={13} />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
