"use client";

import Button from "./Button";
import AllergyPicker from "./AllergyPicker";
import type { Guest } from "@/types";

interface GuestRsvpFieldProps {
  guest: Guest;
  attending: boolean | null;
  onAttendingChange: (attending: boolean) => void;
  locked: boolean;
}

export default function GuestRsvpField({
  guest,
  attending,
  onAttendingChange,
  locked,
}: GuestRsvpFieldProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <input
        type="hidden"
        name={`attending__${guest.id}`}
        value={attending === null ? "" : String(attending)}
      />

      <div className="font-medium text-foreground">{guest.name}</div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant={attending === true ? "primary" : "secondary"}
          aria-pressed={attending === true}
          onClick={() => onAttendingChange(true)}
          disabled={locked}
          size="sm"
          className="flex-1"
        >
          Ja, kommer!
        </Button>
        <Button
          type="button"
          variant={attending === false ? "primary" : "secondary"}
          aria-pressed={attending === false}
          onClick={() => onAttendingChange(false)}
          disabled={locked}
          size="sm"
          className="flex-1"
        >
          Kan inte komma
        </Button>
      </div>

      {attending === true && (
        <AllergyPicker
          name={`allergyTags__${guest.id}`}
          otherFieldName={`allergyOther__${guest.id}`}
          defaultValue={guest.allergy_tags}
          defaultOtherValue={guest.allergy_note}
          disabled={locked}
        />
      )}
    </div>
  );
}
