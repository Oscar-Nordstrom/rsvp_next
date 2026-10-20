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
        className={className}
        onClick={() => setOpen(true)}
      >
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
