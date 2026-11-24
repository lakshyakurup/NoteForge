"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setUser } from "@/lib/history";
import { User, LogOut, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser: { name: string; email?: string } | null;
  onAuthChange: (user: { name: string; email?: string } | null) => void;
};

export function AuthDialog({ open, onClose, currentUser, onAuthChange }: Props) {
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");

  if (!open) return null;

  function handleSave() {
    if (!name.trim()) return;
    const user = { name: name.trim(), email: email.trim() || undefined };
    setUser(user);
    onAuthChange(user);
    onClose();
  }

  function handleLogout() {
    setUser(null);
    onAuthChange(null);
    setName("");
    setEmail("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            {currentUser ? "Your Profile" : "Sign in"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Local profile only — stored in your browser. Used to label saved
          history.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} className="flex-1" disabled={!name.trim()}>
            Save
          </Button>
          {currentUser && (
            <Button variant="outline" onClick={handleLogout} className="gap-1">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
