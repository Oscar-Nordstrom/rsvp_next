"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";
import SubmitButton from "@/app/_components/SubmitButton";

interface RsvpFormProps {
  token: string;
  defaultAttending: boolean | null;
  defaultNote: string | null;
  action: (formData: FormData) => void;
}

export default function RsvpForm({
  token,
  defaultAttending,
  defaultNote,
  action,
}: RsvpFormProps) {
  const [attending, setAttending] = useState<boolean | null>(
    defaultAttending,
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
          className="flex-1"
        >
          Ja, jag kommer!
        </Button>
        <Button
          type="button"
          variant={attending === false ? "primary" : "secondary"}
          aria-pressed={attending === false}
          onClick={() => setAttending(false)}
          className="flex-1"
        >
          Kan inte komma
        </Button>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Meddelande (valfritt)
        <textarea
          name="note"
          defaultValue={defaultNote ?? ""}
          rows={3}
          maxLength={200}
          placeholder="Skriv ett meddelande till oss..."
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
      </label>

      <SubmitButton disabled={attending === null}>Skicka</SubmitButton>
    </form>
  );
}
