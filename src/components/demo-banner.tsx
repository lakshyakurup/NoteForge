"use client";

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-800 dark:text-amber-200 text-center text-xs sm:text-sm py-2 px-3">
      🎭 Demo mode — sample content only. Set <code className="font-mono">NEXT_PUBLIC_DEMO_MODE=false</code> and add an API key for live AI.
    </div>
  );
}
