"use client";

import { useState } from "react";
import { ALLERGY_TAGS, type AllergyTag, ALLERGY_OTHER_TAG } from "@/lib/types";
import { text } from "@/lib/wedding";

interface AllergyPickerProps {
  name: string;
  otherFieldName: string;
  defaultValue?: AllergyTag[];
  defaultOtherValue?: string | null;
  disabled?: boolean;
}

export default function AllergyPicker({
  name,
  otherFieldName,
  defaultValue = [],
  defaultOtherValue,
  disabled,
}: AllergyPickerProps) {
  const [otherChecked, setOtherChecked] = useState(
    defaultValue.includes(ALLERGY_OTHER_TAG),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-foreground">
        {text.form.allergiesLabel}
      </div>
      <div className="flex flex-wrap gap-2">
        {ALLERGY_TAGS.map((tag) => (
          <label key={tag} className="group inline-flex cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={tag}
              defaultChecked={defaultValue.includes(tag)}
              disabled={disabled}
              onChange={
                tag === ALLERGY_OTHER_TAG
                  ? (e) => setOtherChecked(e.target.checked)
                  : undefined
              }
              className="peer sr-only"
            />
            <span
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted
                transition-colors group-hover:border-transparent group-hover:bg-surface-hover
                peer-checked:border-transparent peer-checked:bg-foreground peer-checked:text-background
                peer-checked:group-hover:bg-primary-hover
                peer-disabled:pointer-events-none peer-disabled:opacity-50
                peer-focus-visible:ring-2 peer-focus-visible:ring-border peer-focus-visible:ring-offset-2"
            >
              {tag}
            </span>
          </label>
        ))}
      </div>
      {otherChecked && (
        <input
          type="text"
          name={otherFieldName}
          defaultValue={defaultOtherValue ?? ""}
          placeholder={text.form.allergyOtherPlaceholder}
          disabled={disabled}
          maxLength={200}
          autoFocus
          className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
        />
      )}
    </div>
  );
}
