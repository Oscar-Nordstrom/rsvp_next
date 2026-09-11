"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { Spinner } from "./SubmitButton";

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
  disabled,
  ...props
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={variant}
        size={size}
        disabled={disabled || pending}
        onClick={() => setOpen(true)}
        {...props}
      >
        {pending ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner />
            {children}
          </span>
        ) : (
          children
        )}
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
