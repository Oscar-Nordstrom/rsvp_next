"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import Button from "./Button";

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={className}
        onClick={() => dialogRef.current?.showModal()}
      >
        {label}
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
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="mt-2 flex flex-col gap-2 text-sm text-muted">
          {children}
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => dialogRef.current?.close()}
          >
            Stäng
          </Button>
        </div>
      </dialog>
    </>
  );
}
