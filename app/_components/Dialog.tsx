"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className = "max-w-sm",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
      className={`m-auto w-full rounded-2xl border border-border bg-background p-6 text-foreground backdrop:bg-black/40 ${className}`}
    >
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </dialog>
  );
}
