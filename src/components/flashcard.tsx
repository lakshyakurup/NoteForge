"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  front: string;
  back: string;
};

export function Flashcard({ front, back }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard-scene h-40">
      <div
        className={cn("flashcard", flipped && "flipped")}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
        }}
      >
        <div className="flashcard-face flashcard-front border bg-card text-card-foreground shadow-sm">
          <p className="text-sm font-medium leading-snug">{front}</p>
        </div>
        <div className="flashcard-face flashcard-back border bg-indigo-600 text-white shadow-sm">
          <p className="text-sm leading-snug">{back}</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-1">
        click to flip
      </p>
    </div>
  );
}
