"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  onConfirm,
}: ConfirmDialogProps) {
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
      className="m-auto w-full max-w-sm rounded-2xl border border-border bg-background p-6 text-foreground backdrop:bg-black/40"
    >
      <h2 className="text-base font-semibold">{title}</h2>
      {message && <p className="mt-1 text-sm text-muted">{message}</p>}
      <div className="mt-5 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => dialogRef.current?.close()}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm();
            dialogRef.current?.close();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
