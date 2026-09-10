"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
