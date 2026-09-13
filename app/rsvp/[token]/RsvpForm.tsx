"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";
import SubmitButton from "@/app/_components/SubmitButton";
import Select from "@/app/_components/Select";

interface RsvpFormProps {
  token: string;
  defaultAttending: boolean | null;
  defaultNote: string | null;
  partySize: number;
  defaultAttendingCount: number;
  locked: boolean;
  action: (formData: FormData) => void;
}

export default function RsvpForm({
  token,
  defaultAttending,
  defaultNote,
  partySize,
  defaultAttendingCount,
  locked,
  action,
}: RsvpFormProps) {
  const [attending, setAttending] = useState<boolean | null>(
    defaultAttending,
  );
  const [noteLength, setNoteLength] = useState(defaultNote?.length ?? 0);
  const attendingCountOptions = Array.from(
    { length: partySize },
    (_, index) => index + 1,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <input
        type="hidden"
        name="attending"
        value={attending === null ? "" : String(attending)}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant={attending === true ? "primary" : "secondary"}
          aria-pressed={attending === true}
          onClick={() => setAttending(true)}
          disabled={locked}
          className="flex-1"
        >
          Ja, jag kommer!
        </Button>
        <Button
          type="button"
          variant={attending === false ? "primary" : "secondary"}
          aria-pressed={attending === false}
          onClick={() => setAttending(false)}
          disabled={locked}
          className="flex-1"
        >
          Kan inte komma
        </Button>
      </div>

      {attending === true && partySize > 1 && (
        <label className="flex flex-col gap-1 text-sm text-muted">
          Hur många av er ({partySize}) kommer?
          <Select
            name="attendingCount"
            options={attendingCountOptions}
            defaultValue={Math.max(1, defaultAttendingCount)}
            disabled={locked}
          />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm text-muted">
        Meddelande (specialkost, allergier, frånvarande gäster etc.)
        <textarea
          name="note"
          defaultValue={defaultNote ?? ""}
          onChange={(e) => setNoteLength(e.target.value.length)}
          rows={3}
          maxLength={500}
          disabled={locked}
          placeholder="Skriv ett meddelande till oss..."
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <span className="self-end text-xs text-subtle">
          {noteLength}/500
        </span>
      </label>

      <SubmitButton disabled={locked || attending === null}>
        Skicka
      </SubmitButton>
    </form>
  );
}
