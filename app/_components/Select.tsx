import type { SelectHTMLAttributes } from "react";

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  options: number[];
  compact?: boolean;
}

export default function Select({
  options,
  compact = false,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <select
        {...props}
        className={[
          "w-full appearance-none rounded-md border border-border bg-transparent pr-8 text-sm transition-colors hover:border-transparent hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-50",
          compact ? "px-2 py-1.5" : "px-3 py-2",
        ].join(" ")}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-muted"
        viewBox="0 0 12 8"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 1l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
