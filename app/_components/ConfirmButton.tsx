"use client";

import { useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "./Button";

interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  confirmTitle: string;
  confirmMessage?: string;
  confirmLabel?: string;
  children: ReactNode;
}

export default function ConfirmButton({
  variant,
  size,
  confirmTitle,
  confirmMessage,
  confirmLabel = "Confirm",
  children,
  ...props
}: ConfirmButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => dialogRef.current?.showModal()}
        {...props}
      >
        {children}
      </Button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className="m-auto w-full max-w-sm rounded-2xl border border-border bg-background p-6 text-foreground backdrop:bg-black/40"
      >
        <h2 className="text-base font-semibold">{confirmTitle}</h2>
        {confirmMessage && (
          <p className="mt-1 text-sm text-muted">{confirmMessage}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </Button>
          <Button
            ref={submitRef}
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              dialogRef.current?.close();
              submitRef.current?.form?.requestSubmit();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
