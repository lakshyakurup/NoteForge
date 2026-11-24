"use client";

import {
  Sparkles,
  Wand2,
  History,
  Settings,
  BookOpen,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AppTab = "forge" | "study" | "history" | "status" | "settings";

const items: { id: AppTab; label: string; icon: typeof Sparkles }[] = [
  { id: "forge", label: "Forge", icon: Wand2 },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "history", label: "History", icon: History },
  { id: "status", label: "System", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  userName?: string;
};

export function AppSidebar({ active, onChange, userName }: Props) {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="p-4 flex items-center gap-3 border-b border-border/60">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-bold tracking-tight">NoteForge</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Neural study OS
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              active === id
                ? "bg-primary text-primary-foreground shadow-md shadow-indigo-500/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          {userName ? `Operator: ${userName}` : "Guest session"}
        </div>
      </div>
    </aside>
  );
}
