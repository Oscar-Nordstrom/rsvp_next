"use client";

import { useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";

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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        {...props}
      >
        {children}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel={confirmLabel}
        confirmVariant="danger"
        onConfirm={() => triggerRef.current?.form?.requestSubmit()}
      />
    </>
  );
}
