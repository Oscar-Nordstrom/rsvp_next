"use client";

import { useState } from "react";
import { ALLERGY_TAGS, type AllergyTag, ALLERGY_OTHER_TAG } from "@/types";

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
      <h1>Allergier/Matpreferenser</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {ALLERGY_TAGS.map((tag) => (
          <label
            key={tag}
            className="flex items-center gap-1.5 text-sm text-muted"
          >
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
              className="h-4 w-4 rounded border-border"
            />
            {tag}
          </label>
        ))}
      </div>
      {otherChecked && (
        <input
          type="text"
          name={otherFieldName}
          defaultValue={defaultOtherValue ?? ""}
          placeholder="Beskriv allergin..."
          disabled={disabled}
          maxLength={200}
          className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
        />
      )}
    </div>
  );
}
