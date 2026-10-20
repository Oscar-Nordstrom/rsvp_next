"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Button from "./Button";
import Dialog from "./Dialog";

interface InfoButtonProps {
  label: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

// A soft, pill-shaped trigger with a leading "info" badge — visually
// distinct from the site's outlined secondary buttons (Save/Remove/etc.)
// so it reads as "opens more details" rather than "performs an action".
export default function InfoButton({
  label,
  title,
  children,
  className,
}: InfoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={`inline-flex items-center gap-2 bg-surface-hover ${className ?? ""}`}
        onClick={() => setOpen(true)}
      >
        <span
          aria-hidden
          className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background"
        >
          i
        </span>
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen} title={title}>
        <div className="mt-2 flex flex-col gap-2 text-sm text-muted">
          {children}
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Stäng
          </Button>
        </div>
      </Dialog>
    </>
  );
}
