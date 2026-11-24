"use client";

import { useEffect, useState } from "react";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  type HistoryEntry,
} from "@/lib/history";
import { Button } from "@/components/ui/button";
import { History, Trash2, X, BookOpen, Brain, Layers } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
};

const modeIcon = {
  quiz: Brain,
  concepts: Layers,
  revision: BookOpen,
};

export function HistoryPanel({ open, onClose, onSelect }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (open) setItems(getHistory());
  }, [open]);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteHistoryItem(id);
    setItems(getHistory());
  }

  function handleClear() {
    if (confirm("Clear all history?")) {
      clearHistory();
      setItems([]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border-l shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <History className="h-4 w-4" />
            History
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No saved sessions yet.
              <br />
              Generate something to start.
            </p>
          ) : (
            items.map((item) => {
              const Icon = modeIcon[item.mode];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0 text-indigo-500" />
                      <span className="text-sm font-medium truncate">
                        {item.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.notesPreview}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
