"use client";

import { Wand2, BookOpen, History, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppTab } from "@/components/app-sidebar";

const items: { id: AppTab; icon: typeof Wand2; label: string }[] = [
  { id: "forge", icon: Wand2, label: "Forge" },
  { id: "study", icon: BookOpen, label: "Study" },
  { id: "history", icon: History, label: "History" },
  { id: "status", icon: Activity, label: "Sys" },
  { id: "settings", icon: Settings, label: "Set" },
];

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

export function MobileTabBar({ active, onChange }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="flex justify-around py-2">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]",
              active === id ? "text-indigo-400" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
